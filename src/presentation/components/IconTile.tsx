/**
 * src/presentation/components/IconTile.tsx
 * Mục đích: Ô biểu tượng từ vựng trên bảng giao tiếp (ảnh hoặc chữ cái lớn + nhãn),
 *           vùng chạm lớn, có thể bật/tắt yêu thích. Tối ưu cho trẻ tự kỷ (FR-01,06).
 * Dependency: react-native, react-native-paper, lucide-react-native, Vocabulary.
 */
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Star, Volume2} from 'lucide-react-native';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {TouchTarget} from '@core/constants';
import {ArasaacImage} from './ArasaacImage';

interface Props {
  vocabulary: Vocabulary;
  size: number;
  accentColor?: string;
  isFavorite?: boolean;
  isDirectPlay?: boolean;
  onPress: (v: Vocabulary) => void;
  onToggleFavorite?: (v: Vocabulary) => void;
}

const IconTileComponent: React.FC<Props> = ({
  vocabulary,
  size,
  accentColor,
  isFavorite,
  isDirectPlay,
  onPress,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const bg = accentColor ?? theme.colors.secondaryContainer;
  const label = vocabulary.label();
  
  // Increase image size to fill more space (max 70%)
  const imageSize = Math.max(size * 0.7, 48);

  return (
    <Pressable
      onPress={() => onPress(vocabulary)}
      android_ripple={{color: theme.colors.primary}}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.tile,
        {
          width: size,
          minHeight: size,
          minWidth: TouchTarget.MIN,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}>
      {onToggleFavorite ? (
        <Pressable
          hitSlop={12}
          style={styles.favBtn}
          accessibilityLabel="favorite"
          onPress={() => onToggleFavorite(vocabulary)}>
          <Star
            size={22}
            color={isFavorite ? '#F2B705' : theme.colors.outline}
            fill={isFavorite ? '#F2B705' : 'transparent'}
          />
        </Pressable>
      ) : null}

      {isDirectPlay ? (
        <View style={styles.directPlayIcon}>
          <Volume2 size={18} color={theme.colors.primary} />
        </View>
      ) : null}

      <View
        style={[
          styles.imageWrap,
          {width: imageSize, height: imageSize, backgroundColor: '#FFF'},
        ]}>
        <ArasaacImage keyword={label} bgColor={bg} size={imageSize} />
      </View>

      <Text
        variant="titleMedium"
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.8}
        style={styles.label}
        ellipsizeMode="tail">
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginTop: 0,
  },
  letter: {fontWeight: '700', color: '#3A3A3A'},
  label: {textAlign: 'center', marginTop: 2, lineHeight: 16},
  favBtn: {position: 'absolute', top: 0, right: 0, zIndex: 2, padding: 8},
  directPlayIcon: {position: 'absolute', top: 6, left: 6, zIndex: 2, opacity: 0.6},
});

export const IconTile = React.memo(IconTileComponent);
