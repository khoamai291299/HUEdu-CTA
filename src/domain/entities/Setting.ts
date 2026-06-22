/**
 * src/domain/entities/Setting.ts
 * Mục đích: Kiểu dữ liệu cấu hình ứng dụng (đọc/ghi qua SettingsRepository).
 * Dependency: i18n type, theme type.
 */
import {AppThemeName} from '@core/theme';
import {AppLanguage} from '@core/i18n';

export interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceId: string | null;
}

export interface AppSettings {
  theme: AppThemeName;
  language: AppLanguage;
  speech: SpeechSettings;
  activeChildId: number | null;
  isOnboarded: boolean;
}
