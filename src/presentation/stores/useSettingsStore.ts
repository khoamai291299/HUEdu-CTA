/**
 * src/presentation/stores/useSettingsStore.ts
 * Mục đích: Quản lý trạng thái cấu hình toàn cục (theme, ngôn ngữ, tốc độ/cao độ, giọng,
 *           hồ sơ đang dùng) + áp dụng side-effect (i18n, TTS). (FR-11..14)
 * Dependency: zustand, SettingsUseCases, services DI, i18n, AppSettings.
 */
import {create} from 'zustand';
import {AppSettings} from '@domain/entities/Setting';
import {AppThemeName} from '@core/theme';
import {AppLanguage, changeLanguage} from '@core/i18n';
import {Defaults} from '@core/constants';
import {
  GetSettingsUseCase,
  UpdateSettingsUseCase,
} from '@domain/usecases/settings/SettingsUseCases';
import {getSettingsRepo, getTts} from '@presentation/di/services';

interface SettingsState {
  settings: AppSettings;
  loaded: boolean;
  load: () => Promise<void>;
  setTheme: (theme: AppThemeName) => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setSpeechRate: (rate: number) => Promise<void>;
  setSpeechPitch: (pitch: number) => Promise<void>;
  setVoice: (voiceId: string | null) => Promise<void>;
  setActiveChildId: (id: number | null) => void;
  setIsOnboarded: (isOnboarded: boolean) => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: Defaults.THEME,
  language: Defaults.LANGUAGE,
  speech: {
    rate: Defaults.SPEECH_RATE,
    pitch: Defaults.SPEECH_PITCH,
    voiceId: null,
  },
  activeChildId: null,
  isOnboarded: false,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loaded: false,

  load: async () => {
    const settings = await new GetSettingsUseCase(getSettingsRepo()).execute();
    await changeLanguage(settings.language);
    const tts = getTts();
    await tts.setRate(settings.speech.rate);
    await tts.setPitch(settings.speech.pitch);
    if (settings.speech.voiceId) {
      await tts.setVoice(settings.speech.voiceId).catch(() => undefined);
    }
    set({settings, loaded: true});
  },

  setTheme: async theme => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({theme});
    set({settings: {...get().settings, theme}});
  },

  setLanguage: async language => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({language});
    await changeLanguage(language);
    set({settings: {...get().settings, language}});
  },

  setSpeechRate: async rate => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({rate});
    await getTts().setRate(rate);
    set({
      settings: {...get().settings, speech: {...get().settings.speech, rate}},
    });
  },

  setSpeechPitch: async pitch => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({pitch});
    await getTts().setPitch(pitch);
    set({
      settings: {...get().settings, speech: {...get().settings.speech, pitch}},
    });
  },

  setVoice: async voiceId => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({voiceId});
    if (voiceId) {
      await getTts().setVoice(voiceId).catch(() => undefined);
    }
    set({
      settings: {
        ...get().settings,
        speech: {...get().settings.speech, voiceId},
      },
    });
  },

  setActiveChildId: id =>
    set({settings: {...get().settings, activeChildId: id}}),

  setIsOnboarded: async isOnboarded => {
    await new UpdateSettingsUseCase(getSettingsRepo()).execute({isOnboarded});
    set({settings: {...get().settings, isOnboarded}});
  },
}));
