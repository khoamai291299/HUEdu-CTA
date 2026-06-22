/**
 * src/data/services/LocalTtsService.ts
 * Mục đích: Hiện thực ITtsService bằng react-native-tts (giọng đọc trên máy).
 *           Là NƠI DUY NHẤT phụ thuộc react-native-tts (cô lập rủi ro R2).
 * OOP: implements ITtsService (đa hình - có thể thay bằng MockTtsService).
 * Dependency: react-native-tts, ITtsService, TtsError, logger.
 */
import Tts from 'react-native-tts';
import {
  ITtsService,
  SpeakLanguage,
  TtsVoice,
} from '@domain/services/ITtsService';
import {TtsError} from '@core/errors/TtsError';
import {logger} from '@core/utils/logger';

interface RnTtsVoice {
  id: string;
  name: string;
  language: string;
  notInstalled?: boolean;
  networkConnectionRequired?: boolean;
}

export class LocalTtsService implements ITtsService {
  private initialized = false;
  private engineAvailable = true;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    try {
      // Dùng Promise.race để chặn trường hợp máy ảo (như LDPlayer) bị treo do TTS không bao giờ trả về callback
      await Promise.race([
        Tts.getInitStatus(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TTS_TIMEOUT')), 1500))
      ]);
      this.initialized = true;
      this.engineAvailable = true;
      logger.info('[LocalTtsService] init success');
    } catch (e: unknown) {
      this.engineAvailable = false;
      const code = (e as {code?: string})?.code;
      const msg = (e as Error)?.message;
      if (code === 'no_engine' || msg === 'TTS_TIMEOUT') {
        throw new TtsError('Thiết bị chưa cài hoặc treo engine Text-to-Speech', e);
      }
      throw new TtsError('Không khởi tạo được TTS', e);
    }
  }

  async speak(text: string, language: SpeakLanguage): Promise<void> {
    if (!text.trim() || !this.engineAvailable) {
      return;
    }
    try {
      if (!this.initialized) {
        await Promise.race([
          Tts.getInitStatus(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TTS_TIMEOUT')), 1500))
        ]);
        this.initialized = true;
      }
      await Tts.setDefaultLanguage(language);
      await Tts.stop();
      await Tts.speak(text);
    } catch (e: any) {
      if (e?.message === 'TTS is not ready') {
        // Cố gắng thử lại 1 lần nữa nếu service native bị chậm
        try {
          await new Promise(res => setTimeout(res, 500));
          await Promise.race([
            Tts.getInitStatus(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('TTS_TIMEOUT')), 1500))
          ]);
          this.initialized = true;
          await Tts.setDefaultLanguage(language);
          await Tts.speak(text);
          return;
        } catch (retryError) {
          this.engineAvailable = false;
          return; // Bỏ qua êm đẹp nếu thật sự máy không hỗ trợ
        }
      }
      logger.debug('[LocalTtsService] speak failed silently', e);
    }
  }

  async stop(): Promise<void> {
    await Tts.stop();
  }

  async setRate(rate: number): Promise<void> {
    try {
      await Tts.setDefaultRate(rate);
    } catch (e) {
      logger.debug('[LocalTtsService] setRate failed', e);
    }
  }

  async setPitch(pitch: number): Promise<void> {
    try {
      await Tts.setDefaultPitch(pitch);
    } catch (e) {
      logger.debug('[LocalTtsService] setPitch failed', e);
    }
  }

  async getVoices(): Promise<TtsVoice[]> {
    try {
      if (!this.initialized) {
        await Promise.race([
          Tts.getInitStatus(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TTS_TIMEOUT')), 1500))
        ]);
        this.initialized = true;
      }
      const voices = (await Tts.voices()) as RnTtsVoice[];
      return voices
        .filter(v => !v.notInstalled)
        .map(v => ({id: v.id, name: v.name, language: v.language}));
    } catch (e) {
      logger.warn('[LocalTtsService] getVoices failed', e);
      return [];
    }
  }

  async setVoice(voiceId: string): Promise<void> {
    try {
      await Tts.setDefaultVoice(voiceId);
    } catch (e) {
      logger.debug('[LocalTtsService] setVoice failed', e);
    }
  }

  async hasVoiceForLanguage(languagePrefix: string): Promise<boolean> {
    const voices = await this.getVoices();
    return voices.some(v =>
      v.language.toLowerCase().startsWith(languagePrefix.toLowerCase()),
    );
  }
}
