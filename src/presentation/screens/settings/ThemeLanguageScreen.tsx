/**
 * src/presentation/screens/settings/ThemeLanguageScreen.tsx
 * Mục đích: Chuyển giao diện Sáng/Tối và ngôn ngữ vi/en (FR-11, FR-13).
 * Dependency: useSettingsStore, react-native-paper SegmentedButtons, i18n.
 */
import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {SegmentedButtons, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

const THEMES = [
  {id: 'light', color: '#FFFFFF'},
  {id: 'pale', color: '#D4E6F1'},
  {id: 'pink', color: '#FADBD8'},
  {id: 'green', color: '#D5F5E3'},
  {id: 'lavender', color: '#E8DAEF'},
  {id: 'peach', color: '#FAD7A1'},
  {id: 'mint', color: '#D1F2EB'},
  {id: 'sky', color: '#D6EAF8'},
  {id: 'lemon', color: '#FCF3CF'},
  {id: 'rose', color: '#F5B7B1'},
  {id: 'sand', color: '#EDBB99'},
];

export const ThemeLanguageScreen: React.FC = () => {
  const {t} = useTranslation();
  const themeColors = useTheme();
  const theme = useSettingsStore(s => s.settings.theme);
  const language = useSettingsStore(s => s.settings.language);
  const setTheme = useSettingsStore(s => s.setTheme);
  const setLanguage = useSettingsStore(s => s.setLanguage);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.label}>
        {t('settings.theme')}
      </Text>
      <View style={styles.grid}>
        {THEMES.map(tOption => (
          <TouchableOpacity
            key={tOption.id}
            style={[
              styles.card,
              {backgroundColor: tOption.color},
              theme === tOption.id && {borderWidth: 4, borderColor: themeColors.colors.primary}
            ]}
            onPress={() => setTheme(tOption.id as any)}
          />
        ))}
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {padding: 16, paddingBottom: 40},
  label: {marginTop: 16, marginBottom: 16, fontWeight: 'bold'},
  grid: {flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24},
  card: {width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'transparent'},
});
