/**
 * src/presentation/components/pecs/PecsPickTile.tsx
 * Mục đích: Ô thẻ trong lưới chọn của phụ huynh (Màn 6, Màn 7, Dashboard).
 *           Hiển thị dấu tick (chọn nhiều) hoặc radio (chọn duy nhất 1).
 * Dependency: react-native-paper, lucide, Activity, ArasaacImage.
 */
import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Check, Circle, CircleDot} from 'lucide-react-native';
import {Activity} from '@domain/entities/Activity';
import {ArasaacImage} from '../ArasaacImage';

interface Props {
  card: Activity;
  size: number;
  selected: boolean;
  /** 'radio' = chỉ chọn được 1 (Bước 1 PECS); 'check' = chọn nhiều. */
  mode: 'radio' | 'check';
  disabled?: boolean;
  onPress: (card: Activity) => void;
}

export const PecsPickTile: React.FC<Props> = ({
  card,
  size,
  selected,
  mode,
  disabled,
  onPress,
}) => {
  const theme = useTheme();
  const label = card.label();
  const imageSize = size * 0.46;
  const hasBitmap = !!card.imagePath && !card.imagePath.startsWith('lucide:');

  const marker = () => {
    if (mode === 'check') {
      return selected ? (
        <View style={[styles.badge, {backgroundColor: theme.colors.primary}]}>
          <Check size={16} color={theme.colors.onPrimary} />
        </View>
      ) : null;
    }
    return selected ? (
      <CircleDot size={22} color={theme.colors.primary} />
    ) : (
      <Circle size={22} color={theme.colors.outline} />
    );
  };

  return (
    <Pressable
      onPress={() => onPress(card)}
      disabled={disabled}
      accessibilityRole={mode === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{selected, disabled: !!disabled}}
      accessibilityLabel={label}
      android_ripple={{color: theme.colors.primary}}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: selected
            ? theme.colors.primaryContainer
            : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.outline,
          borderWidth: selected ? 3 : 1.5,
          opacity: disabled ? 0.4 : 1,
        },
      ]}>
      <View style={styles.marker}>{marker()}</View>

      <View style={{width: imageSize, height: imageSize}}>
        {hasBitmap ? (
          <Image source={{uri: card.imagePath as string}} style={styles.image} />
        ) : (
          <ArasaacImage
            keyword={label}
            bgColor={theme.colors.secondaryContainer}
            size={imageSize}
          />
        )}
      </View>

      <Text
        variant="bodyMedium"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        style={[styles.label, {color: theme.colors.onSurface}]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    overflow: 'hidden',
  },
  marker: {position: 'absolute', top: 6, right: 6, zIndex: 2},
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: '100%', height: '100%', resizeMode: 'contain'},
  label: {marginTop: 6, textAlign: 'center', fontWeight: '600'},
});
