/**
 * src/presentation/components/pecs/PecsDropZone.tsx
 * Mục đích: "Vùng nhận" (Drop Zone) riêng cho Child Mode Bước 1 PECS.
 *           Tách khỏi DropZone của bảng giao tiếp hiện có để không ảnh hưởng màn cũ.
 *           Hitbox được nới rộng khi trẻ ở mức vận động tinh 'basic'.
 * Dependency: reanimated, react-native-paper, lucide.
 */
import React, {forwardRef, useImperativeHandle} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {HandHeart} from 'lucide-react-native';

export interface PecsDropZoneRef {
  triggerHighlight: () => void;
}

export interface PecsZoneLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  /** Thẻ đang được kéo vào trong vùng nhận -> đổi màu để trẻ thấy rõ. */
  isHovered: boolean;
  height: number;
  onLayoutChange: (layout: PecsZoneLayout) => void;
}

export const PecsDropZone = forwardRef<PecsDropZoneRef, Props>(
  ({isHovered, height, onLayoutChange}, ref) => {
    const theme = useTheme();
    const flash = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      triggerHighlight: () => {
        flash.value = withSequence(
          withTiming(1, {duration: 120}),
          withTiming(0, {duration: 420}),
        );
      },
    }));

    const flashStyle = useAnimatedStyle(() => ({opacity: flash.value}));

    const handleLayout = (e: LayoutChangeEvent) => {
      const {x, y, width, height: h} = e.nativeEvent.layout;
      onLayoutChange({x, y, width, height: h});
    };

    return (
      <View
        onLayout={handleLayout}
        style={[
          styles.zone,
          {
            height,
            borderColor: isHovered
              ? theme.colors.primary
              : theme.colors.outline,
            backgroundColor: isHovered
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: theme.colors.primary, borderRadius: 24},
            flashStyle,
          ]}
        />
        <HandHeart
          size={48}
          color={
            isHovered ? theme.colors.primary : theme.colors.onSurfaceVariant
          }
        />
        <Text
          variant="titleMedium"
          style={[styles.hint, {color: theme.colors.onSurfaceVariant}]}>
          Đặt thẻ vào đây
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  zone: {
    marginHorizontal: 24,
    borderRadius: 28,
    borderWidth: 4,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 6,
  },
  hint: {fontWeight: '700', opacity: 0.9},
});
