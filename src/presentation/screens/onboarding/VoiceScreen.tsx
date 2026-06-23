import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {Volume2} from 'lucide-react-native';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getTts} from '@presentation/di/services';
import {VBEE_VOICES} from '@core/config/vbeeConfig';

export const VoiceScreen: React.FC<OnboardingScreenProps<'Voice'>> = ({navigation}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const {voiceId, setVoiceId} = useOnboardingStore();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTestVoice = async (id: string) => {
    if (playingId) return;
    setPlayingId(id);
    try {
      const tts = getTts();
      // Set Vbee voice before speaking
      await tts.setVoice(id);
      await tts.speak('Xin chào, tôi là trợ lý hỗ trợ của bạn.', 'vi-VN');
    } catch (e) {
      console.warn('TTS Error:', e);
    } finally {
      setPlayingId(null);
    }
  };

  const columns = 3;
  const paddingHorizontal = 16;
  const gap = 16;
  const maxContentWidth = 400;
  const availableWidth = Math.min(width, maxContentWidth) - (paddingHorizontal * 2) - (gap * (columns - 1));
  const cardWidth = Math.floor(availableWidth / columns);
  const circleSize = Math.min(cardWidth * 0.75, 80);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Bé thích giọng đọc nào?</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Chọn một giọng đọc. Bấm vào loa để nghe thử.
          </Text>
        </View>
        
        <ScrollView style={styles.list} contentContainerStyle={{paddingHorizontal, paddingBottom: 40}}>
          <View style={[styles.grid, {gap}]}>
            {VBEE_VOICES.map(v => {
              const isSelected = voiceId === v.id;
              const isPlaying = playingId === v.id;
              
              return (
                <View key={v.id} style={{width: cardWidth, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[
                      styles.circle,
                      {
                        backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                      },
                      isSelected && {borderWidth: 3, borderColor: theme.colors.primary}
                    ]}
                    onPress={() => {
                      setVoiceId(v.id);
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Speaker icon overlay */}
                    <TouchableOpacity
                      style={styles.speakerBtn}
                      onPress={() => handleTestVoice(v.id)}
                      disabled={!!playingId}
                      hitSlop={8}
                    >
                      {isPlaying ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                      ) : (
                        <Volume2
                          size={circleSize * 0.4}
                          color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
                        />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                  
                  <Text variant="titleSmall" style={[styles.label, {fontSize: Math.min(14, cardWidth * 0.14)}]}>
                    {v.label}
                  </Text>
                  <Text variant="bodySmall" style={[styles.desc, {fontSize: Math.min(11, cardWidth * 0.11)}]}>
                    {v.desc}
                  </Text>
                </View>
              );
            })}
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
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  speakerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {textAlign: 'center', fontWeight: 'bold', marginTop: 2},
  desc: {textAlign: 'center', opacity: 0.7},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
