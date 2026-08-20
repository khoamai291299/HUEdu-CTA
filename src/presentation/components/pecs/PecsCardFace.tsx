/**
 * src/presentation/components/pecs/PecsCardFace.tsx
 * Mục đích: Thẻ hình cỡ lớn hiển thị cho trẻ ở Bước 1 PECS (Child Mode) và dùng lại
 *           trong luồng thiết lập. Có hiệu ứng "sáng lên + nảy nhẹ" khi trao đổi thành công.
 * OOP: expose ref imperative playSuccess() để màn cha kích hoạt animation.
 * Dependency: reanimated, react-native-paper, Activity, ArasaacImage.
 */
import React, {forwardRef, useImperativeHandle} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Activity} from '@domain/entities/Activity';
import {ArasaacImage} from '../ArasaacImage';

export interface PecsCardFaceRef {
  /** Nảy nhẹ + sáng lên — phản hồi khi trẻ trao đổi thẻ thành công. */
  playSuccess: () => void;
}

interface Props {
  card: Activity;
  size: number;
  /** Ẩn nhãn chữ (một số trẻ chỉ tập trung vào hình). */
  showLabel?: boolean;
}

export const PecsCardFace = forwardRef<PecsCardFaceRef, Props>(
  ({card, size, showLabel = true}, ref) => {
    const theme = useTheme();
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      playSuccess: () => {
        scale.value = withSequence(
          withTiming(1.12, {duration: 140}),
          withSpring(1, {damping: 6, stiffness: 160}),
        );
        glow.value = withSequence(
          withTiming(1, {duration: 140}),
          withTiming(0, {duration: 520}),
        );
      },
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const glowStyle = useAnimatedStyle(() => ({opacity: glow.value}));

    const label = card.label();
    const imageSize = size * 0.62;
    const hasBitmap = !!card.imagePath && !card.imagePath.startsWith('lucide:');

    return (
      <Animated.View
        style={[
          styles.card,
          {
            width: size,
            height: size,
            backgroundColor: theme.colors.primaryContainer,
            borderColor: theme.colors.primary,
          },
          animatedStyle,
        ]}>
        {/* Lớp sáng lên khi thành công */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.glow,
            {backgroundColor: theme.colors.primary},
            glowStyle,
          ]}
        />

        <View style={{width: imageSize, height: imageSize}}>
          {hasBitmap ? (
            <Image
              source={{uri: card.imagePath as string}}
              style={styles.image}
            />
          ) : (
            <ArasaacImage
              keyword={label}
              bgColor={theme.colors.secondaryContainer}
              size={imageSize}
            />
          )}
        </View>

        {showLabel ? (
          <Text
            variant="headlineSmall"
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={[styles.label, {color: theme.colors.onPrimaryContainer}]}>
            {label}
          </Text>
        ) : null}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  glow: {borderRadius: 24, opacity: 0},
  image: {width: '100%', height: '100%', resizeMode: 'contain'},
  label: {marginTop: 10, fontWeight: '800', textAlign: 'center'},
});
