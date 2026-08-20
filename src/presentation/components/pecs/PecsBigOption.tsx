/**
 * src/presentation/components/pecs/PecsBigOption.tsx
 * Mục đích: Nút lựa chọn cỡ lớn (Big Touch Target) kèm hình minh hoạ trực quan,
 *           dùng cho các màn đánh giá hành vi. Chạm là chọn — màn tự chuyển tiếp,
 *           không cần nút "Xác nhận"/"Tiếp theo".
 * Dependency: react-native, react-native-paper.
 */
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

interface Props {
  /** Biểu tượng minh hoạ (emoji) hiển thị cỡ lớn bên trái. */
  icon: string;
  title: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
}

export const PecsBigOption: React.FC<Props> = ({
  icon,
  title,
  description,
  selected,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      android_ripple={{color: theme.colors.primary}}
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
          borderColor: selected ? theme.colors.primary : 'transparent',
        },
      ]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {description ? (
          <Text
            variant="bodyMedium"
            style={[styles.desc, {color: theme.colors.onSurfaceVariant}]}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    // Vùng chạm lớn cho phụ huynh thao tác nhanh bằng một tay
    minHeight: 96,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 3,
    gap: 16,
  },
  icon: {fontSize: 40},
  textWrap: {flex: 1},
  title: {fontWeight: '700'},
  desc: {marginTop: 4},
});
