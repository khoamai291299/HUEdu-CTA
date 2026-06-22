import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getTts} from '@presentation/di/services';
import {ArasaacImage} from '@presentation/components/ArasaacImage';

const VOICES = [
  {id: 'girl', label: 'Bé nữ', desc: 'Dễ thương', keyword: 'girl'},
  {id: 'boy', label: 'Bé nam', desc: 'Rõ ràng', keyword: 'boy'},
  {id: 'teen_girl', label: 'Nữ lớn', desc: 'Trong trẻo', keyword: 'woman'},
  {id: 'teen_boy', label: 'Nam lớn', desc: 'Trầm ấm', keyword: 'man'},
  {id: 'neutral', label: 'AI', desc: 'Trung tính', keyword: 'robot'},
  {id: 'teacher', label: 'Giáo viên', desc: 'Truyền cảm', keyword: 'teacher'},
];

export const VoiceScreen: React.FC<OnboardingScreenProps<'Voice'>> = ({navigation}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const {voiceId, setVoiceId} = useOnboardingStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestVoice = async (id: string) => {
    setIsPlaying(true);
    try {
      const tts = getTts();
      await tts.speak('Xin chào, tôi là trợ lý hỗ trợ của bạn.', 'vi-VN');
    } catch (e) {
      console.warn('TTS Error:', e);
    } finally {
      setIsPlaying(false);
    }
  };

  const columns = 3;
  const paddingHorizontal = 16;
  const gap = 12;
  const maxContentWidth = 400;
  const availableWidth = Math.min(width, maxContentWidth) - (paddingHorizontal * 2) - (gap * (columns - 1));
  const cardWidth = Math.floor(availableWidth / columns);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Bé thích giọng đọc nào?</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Chọn một giọng đọc miễn phí. Bấm vào để nghe thử.
          </Text>
        </View>
        
        <ScrollView style={styles.list} contentContainerStyle={{paddingHorizontal, paddingBottom: 40}}>
          <View style={[styles.grid, {gap}]}>
            {VOICES.map(v => (
              <View key={v.id} style={{width: cardWidth, alignItems: 'center'}}>
                <TouchableOpacity
                  style={[
                    styles.circle,
                    {backgroundColor: theme.colors.surfaceVariant, width: cardWidth * 0.7, height: cardWidth * 0.7, borderRadius: (cardWidth * 0.7) / 2},
                    voiceId === v.id && {borderWidth: 4, borderColor: theme.colors.primary}
                  ]}
                  onPress={() => {
                    setVoiceId(v.id);
                    handleTestVoice(v.id);
                  }}
                  disabled={isPlaying}
                >
                  <ArasaacImage keyword={v.keyword} size={cardWidth * 0.4} />
                </TouchableOpacity>
                <Text variant="titleSmall" style={[styles.label, {fontSize: Math.min(cardWidth * 0.15, 18)}]}>{v.label}</Text>
                <Text variant="bodySmall" style={[styles.desc, {fontSize: Math.min(cardWidth * 0.12, 13)}]}>{v.desc}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()}>Quay lại</Button>
          <Button mode="contained" onPress={() => navigation.navigate('Username')}>Tiếp tục</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 450, alignSelf: 'center'},
  header: {paddingHorizontal: 24, paddingTop: 40},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 32, opacity: 0.7},
  list: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  circle: {justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden'},
  label: {textAlign: 'center', fontWeight: 'bold'},
  desc: {textAlign: 'center', opacity: 0.7},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
