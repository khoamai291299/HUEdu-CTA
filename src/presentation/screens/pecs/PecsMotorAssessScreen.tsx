/**
 * src/presentation/screens/pecs/PecsMotorAssessScreen.tsx
 * Mục đích: Màn 5 — Đánh giá vận động tinh. Đây là nhánh Decision Tree quyết định
 *           GIAO DIỆN của trẻ ở Bước 5:
 *             - 'basic'    -> màn trống, chỉ 1 thẻ, trẻ CHẠM (hitbox lớn, hút thẻ mạnh)
 *             - 'standard' -> 1 thẻ + Vùng nhận, trẻ KÉO - THẢ
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
import {PecsMotorLevel} from '@domain/entities/PecsConfig';

const OPTIONS: Array<{
  id: string;
  icon: string;
  title: string;
  description: string;
  level: PecsMotorLevel;
}> = [
  {
    id: 'A',
    icon: '👆',
    title: 'Chỉ chạm đập nhẹ, chưa biết vuốt.',
    description: '',
    level: 'basic',
  },
  {
    id: 'B',
    icon: '🤙',
    title: 'Biết vuốt và kéo thả cơ bản.',
    description: '',
    level: 'standard',
  },
];

const AUTO_ADVANCE_MS = 260;

export const PecsMotorAssessScreen: React.FC<
  PecsScreenProps<'PecsMotorAssess'>
> = ({navigation}) => {
  const theme = useTheme();
  const save = usePecsStore(s => s.save);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const childName = child?.name?.trim() || 'Bé';

  // `picked` chặn chạm hai lần trong lúc chờ auto-advance. Màn vẫn nằm trong
  // stack khi ba mẹ bấm "Quay lại", nên PHẢI reset lúc màn được focus lại —
  // nếu không sẽ bị khoá, không đổi được đáp án.
  const [picked, setPicked] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setPicked(null);
    }, []),
  );

  const handlePick = (optionId: string, level: PecsMotorLevel) => {
    if (picked) {
      return;
    }
    setPicked(optionId);
    save({motorLevel: level}).catch(() => undefined);
    setTimeout(() => navigation.navigate('PecsRewardPick'), AUTO_ADVANCE_MS);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={5} label="Đánh giá hành vi" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.heading}>
          Đánh giá Vận động tinh
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.question, {color: theme.colors.onSurfaceVariant}]}>
          {`${childName} thao tác trên điện thoại/iPad như thế nào?`}
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
