/**
 * src/core/i18n/index.ts
 * Mục đích: Khởi tạo i18next + react-i18next với 2 ngôn ngữ vi/en.
 * Dependency: i18next, react-i18next, locales json.
 */
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import vi from './locales/vi.json';

export type AppLanguage = 'vi';

export const initI18n = (language: AppLanguage = 'vi'): typeof i18n => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: {
        vi: {translation: vi},
      },
      lng: language,
      fallbackLng: 'vi',
      interpolation: {escapeValue: false},
      compatibilityJSON: 'v4',
    });
  }
  return i18n;
};

export const changeLanguage = (language: AppLanguage): Promise<unknown> =>
  i18n.changeLanguage(language);

export default i18n;
