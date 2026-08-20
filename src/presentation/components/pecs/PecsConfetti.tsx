/**
 * src/presentation/components/pecs/PecsConfetti.tsx
 * Mục đích: Hiệu ứng pháo giấy rơi khi trẻ trao đổi thẻ thành công — phần thưởng
 *           thị giác tức thì, củng cố quy luật nhân quả.
 *           Tự vẽ bằng reanimated, không thêm thư viện native nào.
 * Dependency: react-native-reanimated.
 */
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];
const PIECE_COUNT = 26;
const FALL_MS = 2200;

interface PieceProps {
  /** Đổi giá trị -> chạy lại animation. 0 = chưa chạy lần nào. */
  trigger: number;
  startX: number;
  color: string;
  size: number;
  delay: number;
  drift: number;
  spin: number;
  fallHeight: number;
}

const ConfettiPiece: React.FC<PieceProps> = ({
  trigger,
  startX,
  color,
  size,
  delay,
  drift,
  spin,
  fallHeight,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) {
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      delay,
      withTiming(1, {duration: FALL_MS, easing: Easing.linear}),
    );
  }, [trigger, delay, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p === 0 || p >= 1 ? 0 : 1,
      transform: [
        {translateX: startX + drift * p},
        {translateY: -40 + fallHeight * p},
        {rotate: `${spin * p}deg`},
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {width: size, height: size * 0.6, backgroundColor: color},
        style,
      ]}
    />
  );
};

interface Props {
  /** Tăng giá trị này mỗi lần muốn bắn pháo giấy. */
  trigger: number;
}

export const PecsConfetti: React.FC<Props> = ({trigger}) => {
  const {width, height} = useWindowDimensions();

  // Tham số ngẫu nhiên cố định theo vòng đời component để mảnh giấy không
  // nhảy vị trí giữa các lần render.
  const pieces = useMemo(
    () =>
      Array.from({length: PIECE_COUNT}, (_, i) => ({
        key: i,
        startX: Math.random() * width,
        color: COLORS[i % COLORS.length],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 450,
        drift: (Math.random() - 0.5) * 140,
        spin: 360 + Math.random() * 720,
      })),
    [width],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map(p => (
        <ConfettiPiece
          key={p.key}
          trigger={trigger}
          startX={p.startX}
          color={p.color}
          size={p.size}
          delay={p.delay}
          drift={p.drift}
          spin={p.spin}
          fallHeight={height + 120}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {position: 'absolute', top: 0, left: 0, borderRadius: 2},
});
