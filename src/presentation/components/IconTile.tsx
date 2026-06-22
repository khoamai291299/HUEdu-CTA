/**
 * src/presentation/components/IconTile.tsx
 * Mục đích: Ô biểu tượng từ vựng trên bảng giao tiếp (ảnh hoặc chữ cái lớn + nhãn),
 *           vùng chạm lớn, có thể bật/tắt yêu thích. Tối ưu cho trẻ tự kỷ (FR-01,06).
 * Dependency: react-native, react-native-paper, lucide-react-native, Vocabulary.
 */
import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Star, Volume2} from 'lucide-react-native';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {TouchTarget} from '@core/constants';
import {LucideIcon} from './LucideIcon';

interface Props {
  vocabulary: Vocabulary;
  size: number;
  lang: 'vi' | 'en';
  accentColor?: string;
  isFavorite?: boolean;
  isDirectPlay?: boolean;
  onPress: (v: Vocabulary) => void;
  onToggleFavorite?: (v: Vocabulary) => void;
}

const IconTileComponent: React.FC<Props> = ({
  vocabulary,
  size,
  lang,
  accentColor,
  isFavorite,
  isDirectPlay,
  onPress,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const bg = accentColor ?? theme.colors.secondaryContainer;
  const label = vocabulary.label(lang);
  
  // Calculate dynamic image size based on available width, leaving room for text
  const imageSize = Math.max(size * 0.45, 36);

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
          minHeight: size, // Allow text to expand downward
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
          {width: imageSize, height: imageSize, backgroundColor: bg},
        ]}>
        {vocabulary.imagePath?.startsWith('lucide:') ? (
          <LucideIcon
            name={vocabulary.imagePath.replace('lucide:', '')}
            size={imageSize * 0.65}
            color="#3A3A3A"
          />
        ) : vocabulary.imagePath ? (
          <Image
            source={{uri: vocabulary.imagePath}}
            style={{width: imageSize, height: imageSize, borderRadius: 12}}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.letter, {fontSize: imageSize * 0.5}]}>
            {label.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <Text
        variant="labelMedium"
        numberOfLines={3}
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
