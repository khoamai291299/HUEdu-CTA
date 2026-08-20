/**
 * src/presentation/components/pecs/PecsProgressBar.tsx
 * Mục đích: Thanh tiến trình luôn hiển thị ở đầu luồng thiết lập PECS.
 *           Hàng trên: "Bước 4/9" (trái) — nhãn nhóm bước (phải);
 *           hàng dưới: thanh chạy liền, lấp đầy theo tỉ lệ.
 * Dependency: react-native-paper, constants.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Pecs} from '@core/constants';

interface Props {
  /** Bước hiện tại, tính từ 1. */
  step: number;
  /** Nhãn nhóm bước, vd "Đánh giá hành vi". */
  label: string;
}

export const PecsProgressBar: React.FC<Props> = ({step, label}) => {
  const theme = useTheme();
  const total = Pecs.TOTAL_SETUP_STEPS;
  const clamped = Math.min(Math.max(step, 1), total);
  const ratio = clamped / total;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text
          variant="titleSmall"
          style={[styles.step, {color: theme.colors.primary}]}>
          {`Bước ${clamped}/${total}`}
        </Text>
        <Text
          variant="titleSmall"
          numberOfLines={1}
          style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
          {label}
        </Text>
      </View>

      <View
        style={[styles.track, {backgroundColor: theme.colors.surfaceVariant}]}>
        <View
          style={[
            styles.fill,
            {backgroundColor: theme.colors.primary, width: `${ratio * 100}%`},
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  step: {fontWeight: '700'},
  label: {flexShrink: 1, textAlign: 'right'},
  track: {height: 5, borderRadius: 3, overflow: 'hidden'},
  fill: {height: '100%', borderRadius: 3},
});
