/**
 * src/presentation/screens/settings/VoiceSettingsScreen.tsx
 * Mục đích: Chọn giọng đọc TTS; cảnh báo nếu thiếu giọng tiếng Việt (FR-12, rủi ro R4).
 * Dependency: services DI (TTS), useSettingsStore, react-native-paper, i18n.
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Volume2, Mic} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {getTts} from '@presentation/di/services';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {VBEE_VOICES} from '@core/config/vbeeConfig';
import {SettingsScreenProps} from '@presentation/navigation/types';

export const VoiceSettingsScreen: React.FC<SettingsScreenProps<'VoiceSettings'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {width} = useWindowDimensions();
  
  const voiceId = useSettingsStore(s => s.settings.speech.voiceId);
  const setVoice = useSettingsStore(s => s.setVoice);
  
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTestVoice = async (id: string, isCloned: boolean = false) => {
    if (playingId) return;
    setPlayingId(id);
    try {
      const tts = getTts();
      await tts.setVoice(id);
      await tts.speak('... Xin chào, tôi là trợ lý giọng nói của bạn.', 'vi-VN');
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

  const allVoices = [...VBEE_VOICES];

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.centerContainer}>
        <ScrollView style={styles.list} contentContainerStyle={{paddingHorizontal, paddingBottom: 40, paddingTop: 20}}>
          <View style={[styles.grid, {gap}]}>
            
            {/* Cloned Voices & Vbee Voices */}
            {allVoices.map(v => {
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
                    onPress={() => setVoice(v.id)}
                    activeOpacity={0.7}
                  >
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 450, alignSelf: 'center'},
  list: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  speakerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {textAlign: 'center', fontWeight: 'bold', marginTop: 2},
  desc: {textAlign: 'center', opacity: 0.7},
});
