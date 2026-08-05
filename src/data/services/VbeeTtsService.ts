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
    const cleanedText = this.cleanText(text);

    if (this.isVbeeAvailable) {
      // Kiểm tra cache in-memory trước — nếu có file sẵn thì phát ngay, không cần dừng trước
      const cacheKey = this.getCacheKey(cleanedText);
      const cachedPath = this.audioCache.get(cacheKey);
      if (cachedPath) {
        try {
          const exists = await RNFS.exists(cachedPath);
          if (exists) {
            // Hủy request đang chạy (nếu có) rồi phát ngay — không stop audio trước để tránh nuốt chữ
            if (this.speakController) {
              this.speakController.abort();
              this.speakController = null;
            }
            logger.info('[VbeeTtsService] Cache hit — playing instantly:', cachedPath);
            await this.playAudioFromPath(cachedPath);
            return;
          } else {
            this.audioCache.delete(cacheKey);
          }
        } catch (_e) {
          this.audioCache.delete(cacheKey);
        }
      }

      // Không có cache — theo yêu cầu, BẤM VÀO LÀ ĐỌC LIỀN, KHÔNG TẢI TRÊN VBEE
      // Chỉ dùng giọng LocalTTS để không bị trễ. (File sẽ được tải ngầm khi thêm từ mới qua hàm preload)
      logger.info('[VbeeTtsService] Không có sẵn file audio, dùng Local TTS để đọc liền.');
    }

    // Dùng LocalTTS
    try { if (SimpleAudioPlayer) { await SimpleAudioPlayer.stop(); } } catch (_) {}
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

  /** Loại bỏ các dấu chấm và khoảng trắng ở đầu chuỗi để tương thích dữ liệu cũ chứa '...' */
  private cleanText(str: string): string {
    return str.replace(/^[\s.]+/, '').trim();
  }

  /** Khoá cache duy nhất theo cặp (voiceCode + text). voiceCode mặc định là giọng hiện tại. */
  private getCacheKey(text: string, voiceCode: string = this.currentVoiceCode): string {
    return String(this.simpleHash(voiceCode + this.cleanText(text)));
  }

  /** Tìm voiceCode Vbee theo voiceId; nếu không chỉ định/không tìm thấy thì dùng giọng hiện tại. */
  private resolveVoiceCode(voiceId?: string): string {
    if (!voiceId) { return this.currentVoiceCode; }
    const voice = VBEE_VOICES.find(v => v.id === voiceId);
    if (voice) { return voice.voiceCode; }
    return this.currentVoiceCode;
  }

  /**
   * Đảm bảo audio cho (text, voiceCode) đã có sẵn trên đĩa — tải về nếu chưa có,
   * KHÔNG phát ra loa. Dùng chung cho speak() (phát ngay) và preload() (tải trước ngầm).
   * Trả về đường dẫn file local, hoặc null nếu bị hủy giữa chừng.
   */
  private async ensureCached(
    text: string,
    voiceCode: string,
    externalSignal: AbortSignal = new AbortController().signal,
  ): Promise<string | null> {
    const cacheKey = this.getCacheKey(text, voiceCode);
    const targetPath = `${RNFS.CachesDirectoryPath}/vbee_${cacheKey}.mp3`;
    const knownPath = this.audioCache.get(cacheKey) ?? targetPath;

    try {
      const exists = await RNFS.exists(knownPath);
      if (exists) {
        this.audioCache.set(cacheKey, knownPath);
        return knownPath;
      }
    } catch (_e) {
      this.audioCache.delete(cacheKey);
    }

    if (externalSignal.aborted) { return null; }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VBEE_CONFIG.timeout);
    const onAbort = () => controller.abort();
    externalSignal.addEventListener('abort', onAbort);

    try {
      const requestBody = {
        app_id: VBEE_CONFIG.appId,
        response_type: 'direct',
        input_text: this.cleanText(text), // Dùng text đã làm sạch để giọng đọc được tự nhiên
        voice_code: voiceCode,
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

      if (externalSignal.aborted) { return null; }

      const rawText = await response.text();
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

      if (externalSignal.aborted) { return null; }

      if (audioUrl) {
        await this.downloadToPath(audioUrl, targetPath);
      } else if (audioBase64) {
        await RNFS.writeFile(targetPath, audioBase64, 'base64');
      } else {
        throw new Error(`No audio data in Vbee response: ${rawText.substring(0, 200)}`);
      }

      if (externalSignal.aborted) { return null; }

      this.audioCache.set(cacheKey, targetPath);
      return targetPath;
    } finally {
      clearTimeout(timeoutId);
      externalSignal.removeEventListener('abort', onAbort);
    }
  }



  /**
   * Tải trước (cache ngầm) audio cho danh sách text — KHÔNG phát ra loa.
   * Giới hạn số request chạy song song để tránh quá tải API/mạng thiết bị.
   */
  async preload(texts: string[], _voiceId?: string): Promise<void> {
    if (!this.isVbeeAvailable) { return; }

    const uniqueTexts = Array.from(
      new Set(texts.map(t => t.trim()).filter(Boolean)),
    );
    if (uniqueTexts.length === 0) { return; }

    // Preload cho tất cả 6 giọng để lưu sẵn offline
    const allVoiceCodes = VBEE_VOICES.map(v => v.voiceCode);
    const tasks: {text: string, voiceCode: string}[] = [];
    for (const text of uniqueTexts) {
      for (const vc of allVoiceCodes) {
        tasks.push({text, voiceCode: vc});
      }
    }

    const concurrency = Math.min(3, tasks.length);
    let cursor = 0;
    const worker = async () => {
      while (cursor < tasks.length) {
        const task = tasks[cursor++];
        try {
          await this.ensureCached(task.text, task.voiceCode);
        } catch (e) {
          logger.debug('[VbeeTtsService] preload thất bại cho 1 câu (bỏ qua):', task.text, e);
        }
      }
    };

    await Promise.all(Array.from({length: concurrency}, () => worker()));
    logger.info(`[VbeeTtsService] Preload hoàn tất (${uniqueTexts.length} câu x 6 giọng).`);
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
    if (!this.isVbeeAvailable) {
      return this.localTts.getVoices();
    }

    const vbeeVoices: TtsVoice[] = VBEE_VOICES.map(v => ({
      id: v.id,
      name: v.label,
      language: 'vi-VN',
    }));

    return [...vbeeVoices];
  }

  async setVoice(voiceId: string): Promise<void> {
    const vbeeVoice = VBEE_VOICES.find(v => v.id === voiceId);
    if (vbeeVoice) {
      this.currentVoiceCode = vbeeVoice.voiceCode;
      logger.info('[VbeeTtsService] Set Vbee voice:', vbeeVoice.label);
      return;
    }

    await this.localTts.setVoice(voiceId);
  }


  async hasVoiceForLanguage(languagePrefix: string): Promise<boolean> {
    if (languagePrefix.toLowerCase().startsWith('vi')) {
      return true;
    }
    return this.localTts.hasVoiceForLanguage(languagePrefix);
  }
}