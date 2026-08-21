/**
 * src/presentation/screens/pecs/PecsVoiceScreen.tsx
 * Mục đích: Bước 3/9 "Giọng đọc" — chọn giọng gần gũi với bé, chạm để nghe thử ngay.
 *           Giọng mặc định là "Ngân Hà" (nữ trẻ em) theo tài liệu.
 * Dependency: PecsProgressBar, useOnboardingStore, vbeeConfig, services DI.
 */
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Volume2} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {getTts} from '@presentation/di/services';
import {VBEE_VOICES} from '@core/config/vbeeConfig';
import {logger} from '@core/utils/logger';

/**
 * Câu nghe thử CỐ ĐỊNH (không chèn tên bé).
 * Audio của câu này đã được tạo sẵn cho cả 6 giọng và đóng gói trong
 * android/app/src/main/assets/audio, nên bấm là phát ngay, đúng giọng, không
 * cần mạng. Nếu chèn tên bé vào câu thì mỗi hồ sơ lại là một chuỗi khác nhau,
 * không thể có sẵn cache -> phải tải mạng -> chậm hoặc rơi xuống giọng máy.
 */
const PREVIEW_TEXT = 'Xin chào bé, mình là bạn của bé nhé!';

export const PecsVoiceScreen: React.FC<PecsScreenProps<'PecsVoice'>> = ({
  navigation,
}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const {voiceId, setVoiceId, username} = useOnboardingStore();
  const childName = username.trim() || 'bé';

  /** Chỉ lượt bấm MỚI NHẤT được phát — tránh nghe nhầm giọng bấm trước đó. */
  const latestPickRef = React.useRef(0);

  const columns = 3;
  const gap = 12;
  const cardWidth = Math.floor(
    (Math.min(width, 520) - 40 - gap * (columns - 1)) / columns,
  );
  const circle = Math.min(cardWidth * 0.78, 88);

  const handlePick = async (id: string) => {
    const ticket = ++latestPickRef.current;
    setVoiceId(id);
    
    try {
      const tts = getTts();
      await tts.stop();
      await tts.setVoice(id);
      // Bấm giọng khác trong lúc chờ -> bỏ lượt này đi.
      if (latestPickRef.current !== ticket) {
        return;
      }
      
      tts.speak(PREVIEW_TEXT, 'vi-VN').catch(e => {
        logger.warn('[PecsVoiceScreen] nghe thử giọng thất bại', e);
      });
    } catch (e) {
      logger.warn('[PecsVoiceScreen] thiết lập giọng thất bại', e);
    }
  };

  const handleNext = async () => {
    try {
      await getTts().stop();
    } catch {
      // Không chặn luồng nếu dừng phát thất bại.
    }
    navigation.navigate('PecsCommAssess');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={3} label="Giọng đọc" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {`Hãy chọn một giọng nói gần gũi với ${childName} nhất.`}
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          Chạm vào từng giọng để nghe thử.
        </Text>

        <View style={[styles.grid, {gap}]}>
          {VBEE_VOICES.map(v => {
            const selected = voiceId === v.id;
            return (
              <View key={v.id} style={{width: cardWidth}}>
                <Pressable
                  onPress={() => handlePick(v.id)}
                  accessibilityRole="radio"
                  accessibilityState={{selected}}
                  accessibilityLabel={v.label}
                  style={[
                    styles.circle,
                    {
                      width: circle,
                      height: circle,
                      borderRadius: circle / 2,
                      backgroundColor: selected
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                      borderColor: selected
                        ? theme.colors.primary
                        : 'transparent',
                    },
                  ]}>
                  <Volume2
                    size={circle * 0.4}
                    color={
                      selected
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant
                    }
                  />
                </Pressable>
                <Text variant="titleSmall" style={styles.voiceLabel}>
                  {v.label}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.voiceDesc,
                    {color: theme.colors.onSurfaceVariant},
                  ]}>
                  {v.desc}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        <Button mode="contained" onPress={handleNext}>
          Tiếp tục
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 24},
  title: {fontWeight: '800', textAlign: 'center', marginTop: 8, marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 24},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 3,
    marginBottom: 6,
  },
  voiceLabel: {textAlign: 'center', fontWeight: '700'},
  voiceDesc: {textAlign: 'center'},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
