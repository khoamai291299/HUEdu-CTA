/**
 * src/domain/services/ITtsService.ts
 * Mục đích: Hợp đồng Text-To-Speech. UI/domain chỉ phụ thuộc interface này,
 *           KHÔNG gọi trực tiếp react-native-tts (đáp ứng FR-03 & rủi ro R2).
 * OOP: cho phép đa hình (LocalTtsService / VbeeTtsService / MockTtsService).
 * Dependency: không.
 */
export interface TtsVoice {
  id: string;
  name: string;
  language: string;
}

export type SpeakLanguage = 'vi-VN';

export interface ITtsService {
  init(): Promise<void>;
  speak(text: string, language: SpeakLanguage): Promise<void>;
  stop(): Promise<void>;
  setRate(rate: number): Promise<void>;
  setPitch(pitch: number): Promise<void>;
  getVoices(): Promise<TtsVoice[]>;
  setVoice(voiceId: string): Promise<void>;
  /** Có giọng cho ngôn ngữ chỉ định không (kiểm tra trước khi đọc). */
  hasVoiceForLanguage(languagePrefix: string): Promise<boolean>;
}
