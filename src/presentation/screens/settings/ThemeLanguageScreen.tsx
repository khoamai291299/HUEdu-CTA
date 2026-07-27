/**
 * src/presentation/screens/settings/ThemeLanguageScreen.tsx
 * Mục đích: Chuyển giao diện Sáng/Tối và ngôn ngữ vi/en (FR-11, FR-13).
 * Dependency: useSettingsStore, react-native-paper SegmentedButtons, i18n.
 */
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@presentation/stores/useSettingsStore';
import { Check, Palette } from 'lucide-react-native';
import { ColorPickerModal } from '@presentation/components/ColorPickerModal';

const CORE_THEMES = [
  { id: 'pale', color: '#D4E6F1' },     // Xanh dương nhạt
  { id: 'peach', color: '#FAD7A1' },    // Cam nhạt/Hồng đào
  { id: 'green', color: '#D5F5E3' },    // Xanh bơ
  { id: 'lemon', color: '#FCF3CF' },    // Vàng kem
  { id: 'light', color: '#FFFFFF' },    // Trắng ngà
  { id: 'dark', color: '#1B1F24' },     // Đen/Dark Mode
];

const OTHER_THEMES = [
  { id: 'pink', color: '#FADBD8' },
  { id: 'green', color: '#D5F5E3' },
  { id: 'lavender', color: '#E8DAEF' },
  { id: 'peach', color: '#FAD7A1' },
  { id: 'mint', color: '#D1F2EB' },
  { id: 'sky', color: '#D6EAF8' },
  { id: 'lemon', color: '#FCF3CF' },
  { id: 'rose', color: '#F5B7B1' },
  { id: 'sand', color: '#EDBB99' },
  { id: 'coral', color: '#F8C4B4' },
  { id: 'lilac', color: '#D7BDE2' },
  { id: 'cream', color: '#FAE5D3' },
  { id: 'silver', color: '#D5D8DC' },
];

export const ThemeLanguageScreen: React.FC = () => {
  const { t } = useTranslation();
  const themeColors = useTheme();
  const theme = useSettingsStore(s => s.settings.theme);
  const setTheme = useSettingsStore(s => s.setTheme);

  const customThemeColor = useSettingsStore(s => s.settings.customThemeColor);
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const handleApplyCustomColor = (hex: string) => {
    setTheme('custom', hex);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Màu nổi bật
        </Text>
      </View>

      <View style={styles.grid}>
        {CORE_THEMES.map(tOption => {
          const isSelected = theme === tOption.id;
          return (
            <TouchableOpacity
              key={tOption.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                { backgroundColor: tOption.color },
                isSelected && {
                  borderWidth: 4,
                  borderColor: themeColors.colors.primary,
                  transform: [{ scale: 1.05 }],
                }
              ]}
              onPress={() => setTheme(tOption.id as any)}
            >
              {isSelected && <Check size={28} color={themeColors.colors.primary} strokeWidth={3} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.headerContainer, { marginTop: 32 }]}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Màu khác
        </Text>
      </View>

      <View style={styles.grid}>
        {OTHER_THEMES.map(tOption => {
          const isSelected = theme === tOption.id;
          return (
            <TouchableOpacity
              key={tOption.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                { backgroundColor: tOption.color },
                isSelected && {
                  borderWidth: 4,
                  borderColor: themeColors.colors.primary,
                  transform: [{ scale: 1.05 }],
                }
              ]}
              onPress={() => setTheme(tOption.id as any)}
            >
              {isSelected && <Check size={28} color={themeColors.colors.primary} strokeWidth={3} />}
            </TouchableOpacity>
          );
        })}
        
        {/* Custom Color Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.card,
            { backgroundColor: '#F0F0F0' },
            theme === 'custom' && {
              borderWidth: 4,
              borderColor: themeColors.colors.primary,
              transform: [{ scale: 1.05 }],
            }
          ]}
          onPress={() => setShowColorPicker(true)}
        >
          {theme === 'custom' ? (
             <View style={[StyleSheet.absoluteFill, { borderRadius: 32, backgroundColor: customThemeColor || themeColors.colors.primary, opacity: 0.2 }]} />
          ) : null}
          <Palette size={28} color={theme === 'custom' ? (customThemeColor || themeColors.colors.primary) : '#666'} />
        </TouchableOpacity>
      </View>

      <ColorPickerModal
        visible={showColorPicker}
        onDismiss={() => setShowColorPicker(false)}
        onApply={handleApplyCustomColor}
        initialColor={customThemeColor || themeColors.colors.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  headerTitle: { fontWeight: 'bold', marginBottom: 8 },
  headerSubtitle: { color: '#666', textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
