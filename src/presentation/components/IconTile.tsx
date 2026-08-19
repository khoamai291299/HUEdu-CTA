/**
 * src/presentation/components/IconTile.tsx
 * Mục đích: Ô biểu tượng từ vựng trên bảng giao tiếp (ảnh hoặc chữ cái lớn + nhãn),
 *           vùng chạm lớn, có thể bật/tắt yêu thích. Tối ưu cho trẻ tự kỷ (FR-01,06).
 * Dependency: react-native, react-native-paper, lucide-react-native, Vocabulary.
 */
import React from 'react';
import {Pressable, StyleSheet, View, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Star, Volume2, MoreVertical} from 'lucide-react-native';
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
  onSettingsPress?: (v: Vocabulary) => void;
}

const IconTileComponent: React.FC<Props> = ({
  vocabulary,
  size,
  accentColor,
  isFavorite,
  isDirectPlay,
  onPress,
  onToggleFavorite,
  onSettingsPress,
}) => {
  const theme = useTheme();
  const bg = accentColor ?? theme.colors.secondaryContainer;
  const label = vocabulary.label();
  
  // Tỷ lệ ảnh 45% để chữ có đủ không gian và không bị sát viền
  const imageSize = Math.max(size * 0.45, 30);

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
          height: size,
          minWidth: TouchTarget.MIN,
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
          borderWidth: 1.5,
          overflow: 'hidden', // Đảm bảo ảnh/text không lòi ra ngoài viền
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

      {onSettingsPress ? (
        <Pressable
          hitSlop={12}
          style={styles.settingsBtn}
          accessibilityLabel="settings"
          onPress={() => onSettingsPress(vocabulary)}>
          <MoreVertical
            size={22}
            color={theme.colors.outline}
          />
        </Pressable>
      ) : null}

      <View
        style={[
          styles.imageWrap,
          {width: imageSize, height: imageSize},
        ]}>
        {(vocabulary.imagePath && !vocabulary.imagePath.startsWith('lucide:')) ? (
          <Image source={{uri: vocabulary.imagePath}} style={{width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 12}} />
        ) : (
          <ArasaacImage keyword={label} bgColor={bg} size={imageSize} />
        )}
      </View>

      <Text
        variant="titleMedium"
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.4}
        style={[styles.label, { width: '100%', color: theme.colors.onPrimaryContainer }]}
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
    padding: 6, // Giảm padding để chữ có thêm không gian ngang
    alignItems: 'center',
    justifyContent: 'center', // Căn giữa khối ảnh và chữ
    flexDirection: 'column',
  },
  imageWrap: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  letter: {fontWeight: '700', color: '#3A3A3A'},
  label: {textAlign: 'center', paddingHorizontal: 2},
  favBtn: {position: 'absolute', top: 0, right: 0, zIndex: 2, padding: 8},
  settingsBtn: {position: 'absolute', top: 0, left: 0, zIndex: 2, padding: 8},
  directPlayIcon: {position: 'absolute', top: 6, left: 6, zIndex: 2, opacity: 0.6},
});

export const IconTile = React.memo(IconTileComponent);
