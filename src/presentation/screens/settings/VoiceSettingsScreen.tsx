/**
 * src/presentation/screens/settings/VoiceSettingsScreen.tsx
 * Mục đích: Chọn giọng đọc TTS; cảnh báo nếu thiếu giọng tiếng Việt (FR-12, rủi ro R4).
 * Dependency: services DI (TTS), useSettingsStore, react-native-paper, i18n.
 */
import React, {useState, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Volume2} from 'lucide-react-native';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {getTts} from '@presentation/di/services';
import {VBEE_VOICES} from '@core/config/vbeeConfig';
import {SettingsScreenProps} from '@presentation/navigation/types';

// Khớp chính xác với chuỗi đã pre-download trong APK (preload_tts.js dòng 18)
const PREVIEW_TEXT = 'Xin chào, tôi là trợ lý hỗ trợ của bạn.';

export const VoiceSettingsScreen: React.FC<SettingsScreenProps<'VoiceSettings'>> = () => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Dừng phát thử ngay khi người dùng chuyển sang màn hình khác / thoát tab
  useFocusEffect(
    useCallback(() => {
      return () => {
        getTts().stop().catch(() => {});
      };
    }, [])
  );

  const voiceId = useSettingsStore(s => s.settings.speech.voiceId);
  const setVoice = useSettingsStore(s => s.setVoice);

  const columns = 3;
  const paddingHorizontal = 16;
  const gap = 16;
  const maxContentWidth = 420;
  const availableWidth =
    Math.min(width, maxContentWidth) - paddingHorizontal * 2 - gap * (columns - 1);
  const cardWidth = Math.floor(availableWidth / columns);
  const circleSize = Math.min(cardWidth * 0.75, 80);

  // Bấm vào giọng: chọn giọng đó VÀ phát thử luôn
  const handleSelectAndPreview = async (id: string, voiceCode: string) => {
    setVoice(id);
    if (playingId === id) return;
    setPlayingId(id);
    try {
      const tts = getTts();
      await tts.stop(); // Dừng giọng cũ đang đọc
      // Gọi setVoice của service TTS để cập nhật giọng đang dùng
      await tts.setVoice(id);
      await tts.speak(PREVIEW_TEXT, 'vi-VN');
    } catch (e) {
      // Không làm gì nếu lỗi
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.centerContainer}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={{
            paddingHorizontal,
            paddingBottom: 40,
            paddingTop: 20,
          }}>
          <View style={[styles.grid, {gap}]}>
            {VBEE_VOICES.map(v => {
              const isSelected = voiceId === v.id;

              // Màu icon cố định, không bao giờ trắng trơn
              const iconColor = isSelected
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant ?? '#666666';

              return (
                <View key={v.id} style={{width: cardWidth, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[
                      styles.circle,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: isSelected
                          ? theme.colors.primaryContainer
                          : theme.colors.surfaceVariant,
                        borderWidth: isSelected ? 3 : 0,
                        borderColor: isSelected ? theme.colors.primary : 'transparent',
                      },
                    ]}
                    onPress={() => handleSelectAndPreview(v.id, v.voiceCode)}
                    activeOpacity={0.7}>
                    <Volume2
                      size={circleSize * 0.4}
                      color={iconColor}
                    />
                  </TouchableOpacity>

                  <Text
                    variant="titleSmall"
                    style={[
                      styles.label,
                      {
                        fontSize: Math.min(14, cardWidth * 0.14),
                        color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                      },
                    ]}>
                    {v.label}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[styles.desc, {fontSize: Math.min(11, cardWidth * 0.11)}]}>
                    {v.desc}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  list: {flex: 1},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // KHÔNG có overflow:'hidden' — đây là nguyên nhân icon bị trắng trơn
  },
  label: {textAlign: 'center', fontWeight: 'bold', marginTop: 2},
  desc: {textAlign: 'center', opacity: 0.7},
});
