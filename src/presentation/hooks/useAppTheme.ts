/**
 * src/presentation/hooks/useAppTheme.ts
 * Mục đích: Trả về theme Material 3 hiện hành dựa trên cấu hình (FR-13).
 * Dependency: useSettingsStore, theme.
 */
import {useMemo} from 'react';
import {getTheme, AppThemeName} from '@core/theme';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';

export const useAppTheme = () => {
  const {settings} = useSettingsStore();
  const themeColor = useOnboardingStore(s => s.themeColor);
  const themeName = settings.isOnboarded ? settings.theme : (themeColor || 'pale') as AppThemeName;
  return useMemo(() => getTheme(themeName), [themeName]);
};
