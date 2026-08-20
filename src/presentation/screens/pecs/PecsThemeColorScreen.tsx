/**
 * src/presentation/screens/pecs/PecsThemeColorScreen.tsx
 * Mục đích: Bước 2/9 "Màu sắc" — chọn bảng màu pastel dịu mắt.
 *           Màu được áp dụng NGAY LẬP TỨC cho toàn ứng dụng (useAppTheme đọc
 *           useOnboardingStore khi chưa onboard xong), nên ba mẹ thấy trước kết quả.
 * Dependency: PecsProgressBar, useOnboardingStore, useSettingsStore.
 */
import React from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Check} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {AppThemeName} from '@core/theme';

/** Giữ nguyên bảng màu của onboarding cũ để không đổi trải nghiệm đã quen. */
const THEMES: Array<{id: AppThemeName; color: string}> = [
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
  {id: 'coral', color: '#F8C4B4'},
  {id: 'lilac', color: '#D7BDE2'},
  {id: 'aqua', color: '#A3E4D7'},
  {id: 'cream', color: '#FAE5D3'},
  {id: 'silver', color: '#D5D8DC'},
];

export const PecsThemeColorScreen: React.FC<
  PecsScreenProps<'PecsThemeColor'>
> = ({navigation}) => {
  const theme = useTheme();
  const {themeColor, setThemeColor, username} = useOnboardingStore();
  const isOnboarded = useSettingsStore(s => s.settings.isOnboarded);
  const setTheme = useSettingsStore(s => s.setTheme);
  const childName = username.trim() || 'bé';

  const handlePick = (id: AppThemeName) => {
    setThemeColor(id);
    // Nếu đã onboard (ba mẹ chạy lại thiết lập), ghi thẳng vào settings để
    // giao diện đổi ngay — vì useAppTheme lúc này đọc settings chứ không đọc
    // store onboarding nữa.
    if (isOnboarded) {
      setTheme(id).catch(() => undefined);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={2} label="Màu sắc" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {`Màu sắc yêu thích của ${childName} là gì?`}
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          Bảng màu pastel dịu mắt, tránh các màu quá chói dễ gây kích thích giác
          quan cho trẻ tự kỷ.
        </Text>

        <View style={styles.grid}>
          {THEMES.map(t => {
            const selected = themeColor === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => handlePick(t.id)}
                accessibilityRole="radio"
                accessibilityState={{selected}}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: t.color,
                    borderColor: selected ? theme.colors.primary : '#CCCCCC',
                    borderWidth: selected ? 4 : 1,
                  },
                ]}>
                {selected ? (
                  <Check size={26} color={theme.colors.primary} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('PecsVoice')}>
          Tiếp tục
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 24},
  title: {fontWeight: '800', textAlign: 'center', marginTop: 8, marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 28},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  swatch: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
