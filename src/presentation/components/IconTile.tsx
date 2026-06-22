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
  const bg = accentColor ?? theme.colors.secondary;
  const label = vocabulary.label(lang);
  
  // Increase image size to fill more space (max 70%)
  const imageSize = Math.max(size * 0.65, 48);
  const fontSize = Math.min(Math.max(size * 0.14, 14), 22);

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
          {width: imageSize, height: imageSize, backgroundColor: '#FFF'},
        ]}>
        <ArasaacImage keyword={label} bgColor={bg} size={imageSize} />
      </View>

      <Text
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.8}
        style={[
          styles.label, 
          {
            fontSize, 
            lineHeight: fontSize * 1.3, 
            letterSpacing: 0.25, 
            fontWeight: '600'
          }
        ]}
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
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginTop: 0,
  },
  label: {textAlign: 'center', marginTop: 2, color: '#3A3A3A'},
  favBtn: {position: 'absolute', top: 0, right: 0, zIndex: 2, padding: 8},
  directPlayIcon: {position: 'absolute', top: 8, left: 8, zIndex: 2, opacity: 0.6},
});

export const IconTile = React.memo(IconTileComponent);
