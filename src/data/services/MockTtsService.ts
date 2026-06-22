/**
 * src/data/services/MockTtsService.ts
 * Mục đích: Hiện thực ITtsService giả lập (không gọi native) - dùng cho unit test
 *           và làm phương án thay thế nếu react-native-tts gặp sự cố (rủi ro R2).
 * OOP: implements ITtsService (cùng interface với LocalTtsService).
 * Dependency: ITtsService.
 */
import {
  ITtsService,
  SpeakLanguage,
  TtsVoice,
} from '@domain/services/ITtsService';

export class MockTtsService implements ITtsService {
  public spokenTexts: Array<{text: string; language: SpeakLanguage}> = [];
  public rate = 0.5;
  public pitch = 1.0;
  public currentVoiceId: string | null = null;

  async init(): Promise<void> {
    /* no-op */
  }

  async speak(text: string, language: SpeakLanguage): Promise<void> {
    this.spokenTexts.push({text, language});
  }

  async stop(): Promise<void> {
    /* no-op */
  }

  async setRate(rate: number): Promise<void> {
    this.rate = rate;
  }

  async setPitch(pitch: number): Promise<void> {
    this.pitch = pitch;
  }

  async getVoices(): Promise<TtsVoice[]> {
    return [
      {id: 'mock-vi', name: 'Mock Vietnamese', language: 'vi-VN'},
      {id: 'mock-en', name: 'Mock English', language: 'en-US'},
    ];
  }

  async setVoice(voiceId: string): Promise<void> {
    this.currentVoiceId = voiceId;
  }

  async hasVoiceForLanguage(languagePrefix: string): Promise<boolean> {
    const voices = await this.getVoices();
    return voices.some(v =>
      v.language.toLowerCase().startsWith(languagePrefix.toLowerCase()),
    );
  }
}
