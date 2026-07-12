/**
 * src/data/services/VbeeTtsService.ts
 * Mục đích: Hiện thực ITtsService bằng Vbee REST API.
 *           Gọi API Vbee (endpoint direct/đồng bộ) để chuyển văn bản thành giọng nói.
 *           Fallback về LocalTtsService nếu API không khả dụng.
 *           Cache file audio local để phát lại tức thì (không download lại cùng 1 đoạn text).
 * Dependency: ITtsService, vbeeConfig, react-native-fs, native module SimpleAudioPlayer
 *             (xem SimpleAudioPlayerModule.kt / SimpleAudioPlayerPackage.kt).
 */
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import {
  ITtsService,
  SpeakLanguage,
  TtsVoice,
} from '@domain/services/ITtsService';
import { VBEE_CONFIG, VBEE_VOICES } from '@core/config/vbeeConfig';
import { LocalTtsService } from './LocalTtsService';
import { logger } from '@core/utils/logger';

const { SimpleAudioPlayer } = NativeModules;

export class VbeeTtsService implements ITtsService {
  private localTts: LocalTtsService;
  private currentVoiceCode: string = VBEE_VOICES[0].voiceCode;
  private speed: number = VBEE_CONFIG.defaultSpeed;
  private isVbeeAvailable: boolean = false;
  /** Cache: cacheKey → filePath trên thiết bị (tránh download lại cùng một đoạn text). */
  private audioCache: Map<string, string> = new Map();
  /** AbortController của request Vbee đang chạy — bị hủy khi có speak mới, tránh race condition. */
  private speakController: AbortController | null = null;

  constructor() {
    this.localTts = new LocalTtsService();
    this.isVbeeAvailable = VBEE_CONFIG.accessToken.length > 10;
  }

  async init(): Promise<void> {
    try {
      await this.localTts.init();
    } catch (_e) {
      logger.debug('[VbeeTtsService] Local TTS init failed (will use Vbee only)');
    }

    if (!SimpleAudioPlayer) {
      logger.warn('[VbeeTtsService] SimpleAudioPlayer native module chưa được đăng ký — kiểm tra lại MainApplication.kt và rebuild native.');
    }

    // Khôi phục cache từ đĩa để tránh download lại các file đã tồn tại từ lần dùng trước.
    try {
      const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
      for (const file of files) {
        if (file.name.startsWith('vbee_') && file.name.endsWith('.mp3')) {
          const key = file.name.slice(5, -4); // cắt tiền tố 'vbee_' và hậu tố '.mp3'
          this.audioCache.set(key, file.path);
        }
      }
      if (this.audioCache.size > 0) {
        logger.info(`[VbeeTtsService] Đã khôi phục ${this.audioCache.size} file audio từ cache disk.`);
      }
    } catch (_e) {
      logger.debug('[VbeeTtsService] Không đọc được cache từ đĩa.');
    }

    if (this.isVbeeAvailable) {
      logger.info('[VbeeTtsService] Vbee TTS is configured and available');
    } else {
      logger.info('[VbeeTtsService] Vbee token not configured, using local TTS fallback');
    }
  }

  async speak(text: string, _language: SpeakLanguage): Promise<void> {
    if (!text.trim()) return;

    // Hủy request Vbee đang chạy và dừng audio đang phát trước khi bắt đầu speak mới.
    if (this.speakController) {
      this.speakController.abort();
      this.speakController = null;
    }
    try { if (SimpleAudioPlayer) { await SimpleAudioPlayer.stop(); } } catch (_) {}
    this.localTts.stop().catch(() => {});

    if (this.isVbeeAvailable) {
      const ctrl = new AbortController();
      this.speakController = ctrl;
      try {
        await this.speakWithVbee(text, ctrl.signal);
        return;
      } catch (e) {
        // Bị hủy bởi speak mới — bỏ qua, không fallback.
        if (ctrl.signal.aborted) { return; }
        // Vbee thất bại (lỗi API, timeout, mạng...) —
        // KHÔNG fallback sang Google TTS để tránh đọc sai giọng.
        logger.warn('[VbeeTtsService] Vbee API thất bại (im lặng, không dùng Google TTS):', e);
        return;
      } finally {
        if (this.speakController === ctrl) { this.speakController = null; }
      }
    }

    // Chỉ dùng LocalTTS khi chưa cấu hình Vbee (không có token — chế độ offline).
    await this.localTts.speak(text, 'vi-VN');
  }

  /** Tạo hash số nguyên 32-bit từ chuỗi (không cần thư viện crypto). */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // ép về 32-bit integer
    }
    return Math.abs(hash);
  }

  /** Khoá cache duy nhất theo cặp (voiceCode + text). */
  private getCacheKey(text: string): string {
    return String(this.simpleHash(this.currentVoiceCode + text.trim()));
  }

  private async speakWithVbee(text: string, externalSignal: AbortSignal): Promise<void> {
    // Kiểm tra cache trước — nếu đã có file local thì phát ngay, không cần gọi API
    const cacheKey = this.getCacheKey(text);
    const cachedPath = this.audioCache.get(cacheKey);
    if (cachedPath) {
      try {
        const exists = await RNFS.exists(cachedPath);
        if (exists) {
          if (externalSignal.aborted) { return; }
          logger.info('[VbeeTtsService] Cache hit, playing:', cachedPath);
          await this.playAudioFromPath(cachedPath);
          return;
        }
      } catch (_e) {
        // File bị xóa ngoài app, xóa khỏi cache
        this.audioCache.delete(cacheKey);
      }
    }

    if (externalSignal.aborted) { return; }

    // Kết hợp timeout abort với tín hiệu hủy từ speak mới (externalSignal).
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VBEE_CONFIG.timeout);
    const onAbort = () => controller.abort();
    externalSignal.addEventListener('abort', onAbort);

    try {
      const requestBody = {
        app_id: VBEE_CONFIG.appId,
        response_type: 'direct',
        input_text: text,
        voice_code: this.currentVoiceCode,
        audio_type: VBEE_CONFIG.format,
        speed_rate: String(this.speed),
        bitrate: 128,
      };

      logger.info('[VbeeTtsService] Request:', JSON.stringify(requestBody));

      const response = await fetch(VBEE_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VBEE_CONFIG.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (externalSignal.aborted) { return; }

      const rawText = await response.text();
      // Dùng warn để log xuất hiện ngay cả trong bản release (giúp debug).
      logger.warn('[VbeeTtsService] Response status:', response.status);
      logger.warn('[VbeeTtsService] Response body (300 ký tự đầu):', rawText.substring(0, 300));

      if (!response.ok) {
        throw new Error(`Vbee API error: ${response.status} - ${rawText}`);
      }

      const data = JSON.parse(rawText);

      const audioUrl =
        data.audio_url ||
        data.result?.audio_url ||
        data.result?.audio_link ||
        data.audio_link ||
        data.data?.audio_link;
      const audioBase64 = data.audio || data.result?.audio;

      // Đường dẫn file cache theo cacheKey (tên file an toàn, không có ký tự đặc biệt)
      const targetPath = `${RNFS.CachesDirectoryPath}/vbee_${cacheKey}.mp3`;

      if (externalSignal.aborted) { return; }

      if (audioUrl) {
        await this.downloadToPath(audioUrl, targetPath);
      } else if (audioBase64) {
        await RNFS.writeFile(targetPath, audioBase64, 'base64');
      } else {
        throw new Error(`No audio data in Vbee response: ${rawText.substring(0, 200)}`);
      }

      if (externalSignal.aborted) { return; }

      // Lưu vào cache để lần sau phát ngay không cần gọi API
      this.audioCache.set(cacheKey, targetPath);
      await this.playAudioFromPath(targetPath);
    } finally {
      clearTimeout(timeoutId);
      externalSignal.removeEventListener('abort', onAbort);
    }
  }

  /** Download file audio từ URL về đường dẫn chỉ định. */
  private async downloadToPath(url: string, filePath: string): Promise<void> {
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;
    logger.info('[VbeeTtsService] Audio downloaded to:', filePath);
  }

  /** Phát file audio từ đường dẫn local bằng SimpleAudioPlayer native module. */
  private async playAudioFromPath(filePath: string): Promise<void> {
    if (!SimpleAudioPlayer) {
      throw new Error('SimpleAudioPlayer native module is missing — cần rebuild native app');
    }
    await SimpleAudioPlayer.play('file://' + filePath);
  }

  async stop(): Promise<void> {
    // Hủy request Vbee đang chờ (nếu có).
    if (this.speakController) {
      this.speakController.abort();
      this.speakController = null;
    }
    try {
      if (SimpleAudioPlayer) {
        await SimpleAudioPlayer.stop();
      }
    } catch (e) {
      logger.warn('[VbeeTtsService] Error stopping audio', e);
    }
    await this.localTts.stop().catch(() => {});
  }

  async setRate(rate: number): Promise<void> {
    this.speed = rate > 0 ? rate * 2 : VBEE_CONFIG.defaultSpeed;
    await this.localTts.setRate(rate);
  }

  async setPitch(pitch: number): Promise<void> {
    await this.localTts.setPitch(pitch);
  }

  async getVoices(): Promise<TtsVoice[]> {
    const vbeeVoices: TtsVoice[] = VBEE_VOICES.map(v => ({
      id: v.id,
      name: v.label,
      language: 'vi-VN',
    }));

    if (!this.isVbeeAvailable) {
      return this.localTts.getVoices();
    }

    return vbeeVoices;
  }

  async setVoice(voiceId: string): Promise<void> {
    const vbeeVoice = VBEE_VOICES.find(v => v.id === voiceId);
    if (vbeeVoice) {
      this.currentVoiceCode = vbeeVoice.voiceCode;
      logger.info('[VbeeTtsService] Set Vbee voice:', vbeeVoice.label);
    } else {
      await this.localTts.setVoice(voiceId);
    }
  }

  async hasVoiceForLanguage(languagePrefix: string): Promise<boolean> {
    if (languagePrefix.toLowerCase().startsWith('vi')) {
      return true;
    }
    return this.localTts.hasVoiceForLanguage(languagePrefix);
  }
}