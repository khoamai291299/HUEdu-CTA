/**
 * src/presentation/screens/pecs/PecsCommAssessScreen.tsx
 * Mục đích: Màn 4 — Đánh giá giao tiếp. Hệ thống ngầm ghi nhận giai đoạn hiện tại
 *           của trẻ (Decision Tree). Chạm là chọn, màn tự chuyển tiếp.
 * Dependency: PecsProgressBar, PecsBigOption, usePecsStore.
 */
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {PecsBigOption} from '@presentation/components/pecs/PecsBigOption';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {PecsCommLevel} from '@domain/entities/PecsConfig';

const OPTIONS: Array<{
  id: string;
  icon: string;
  title: string;
  description: string;
  level: PecsCommLevel;
}> = [
  {
    id: 'A',
    icon: '😭',
    title: 'Khóc/La hét/Tự lấy.',
    description: '',
    level: 'stage1',
  },
  {
    id: 'B',
    icon: '🤝',
    title: 'Kéo tay ba mẹ.',
    description: '',
    level: 'stage1',
  },
  {
    id: 'C',
    icon: '👆',
    title: 'Đưa hình/Chỉ tay chính xác.',
    description: '',
    level: 'advanced',
  },
];

/** Trễ ngắn để phụ huynh kịp thấy lựa chọn được tô sáng trước khi chuyển màn. */
const AUTO_ADVANCE_MS = 260;

export const PecsCommAssessScreen: React.FC<
  PecsScreenProps<'PecsCommAssess'>
> = ({navigation}) => {
  const theme = useTheme();
  const save = usePecsStore(s => s.save);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const childName = child?.name?.trim() || 'bé';

  // `picked` chặn chạm hai lần trong lúc chờ auto-advance. Màn vẫn nằm trong
  // stack khi ba mẹ bấm "Quay lại", nên PHẢI reset lúc màn được focus lại —
  // nếu không sẽ bị khoá, không đổi được đáp án.
  const [picked, setPicked] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setPicked(null);
    }, []),
  );

  const handlePick = (optionId: string, level: PecsCommLevel) => {
    if (picked) {
      return;
    }
    setPicked(optionId);
    save({commLevel: level}).catch(() => undefined);
    setTimeout(() => navigation.navigate('PecsMotorAssess'), AUTO_ADVANCE_MS);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={4} label="Đánh giá hành vi" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.heading}>
          Đánh giá Giao tiếp
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.question, {color: theme.colors.onSurfaceVariant}]}>
          {`Hiện tại, khi muốn một món đồ ngoài tầm tay, ${childName} thường làm gì?`}
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(o => (
            <PecsBigOption
              key={o.id}
              icon={o.icon}
              title={o.title}
              description={o.description}
              selected={picked === o.id}
              onPress={() => handlePick(o.id, o.level)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        <Text
          variant="bodySmall"
          style={{color: theme.colors.onSurfaceVariant}}>
          Chạm để chọn và tự chuyển trang
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingBottom: 24},
  heading: {fontWeight: '800', textAlign: 'center', marginTop: 12, marginBottom: 10},
  question: {textAlign: 'center', marginBottom: 26},
  options: {gap: 14},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
});
