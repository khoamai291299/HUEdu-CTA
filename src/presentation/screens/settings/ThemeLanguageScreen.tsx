/**
 * src/presentation/screens/settings/ThemeLanguageScreen.tsx
 * Mục đích: Chuyển giao diện Sáng/Tối và ngôn ngữ vi/en (FR-11, FR-13).
 * Dependency: useSettingsStore, react-native-paper SegmentedButtons, i18n.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SegmentedButtons, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

export const ThemeLanguageScreen: React.FC = () => {
  const {t} = useTranslation();
  const theme = useSettingsStore(s => s.settings.theme);
  const language = useSettingsStore(s => s.settings.language);
  const setTheme = useSettingsStore(s => s.setTheme);
  const setLanguage = useSettingsStore(s => s.setLanguage);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>
        {t('settings.theme')}
      </Text>
      <SegmentedButtons
        value={theme}
        onValueChange={v => setTheme(v as any)}
        buttons={[
          {value: 'light', label: t('settings.light') || 'Sáng', icon: 'white-balance-sunny'},
          {value: 'dark', label: t('settings.dark') || 'Tối', icon: 'weather-night'},
          {value: 'forest', label: 'Rừng', icon: 'tree'},
          {value: 'ocean', label: 'Biển', icon: 'water'},
        ]}
      />

      <Text variant="titleMedium" style={styles.label}>
        {t('settings.language')}
      </Text>
      <SegmentedButtons
        value={language}
        onValueChange={v => setLanguage(v as 'vi' | 'en')}
        buttons={[
          {value: 'vi', label: 'Tiếng Việt'},
          {value: 'en', label: 'English'},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  label: {marginTop: 16, marginBottom: 8},
});
