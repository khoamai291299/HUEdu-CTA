/**
 * src/presentation/hooks/useAppTheme.ts
 * Mục đích: Trả về theme Material 3 hiện hành dựa trên cấu hình (FR-13).
 * Dependency: useSettingsStore, theme.
 */
import {useMemo} from 'react';
import {getTheme} from '@core/theme';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

export const useAppTheme = () => {
  const themeName = useSettingsStore(s => s.settings.theme);
  return useMemo(() => getTheme(themeName), [themeName]);
};
