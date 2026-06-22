/**
 * src/presentation/screens/settings/SpeechSettingsScreen.tsx
 * Mục đích: Điều chỉnh tốc độ & cao độ giọng đọc (bộ tăng/giảm, không cần lib slider) +
 *           nút nghe thử (FR-12).
 * Dependency: useSettingsStore, services DI (TTS), react-native-paper, i18n.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, IconButton, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {getTts} from '@presentation/di/services';
import {clamp} from '@core/utils/validators';

const Stepper: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}> = ({label, value, min, max, step, onChange}) => (
  <Card style={styles.card}>
    <Card.Content style={styles.row}>
      <Text variant="titleMedium">{label}</Text>
      <View style={styles.stepper}>
        <IconButton
          icon="minus"
          mode="contained-tonal"
          onPress={() => onChange(clamp(+(value - step).toFixed(2), min, max))}
        />
        <Text variant="titleLarge" style={styles.value}>
          {value.toFixed(2)}
        </Text>
        <IconButton
          icon="plus"
          mode="contained-tonal"
          onPress={() => onChange(clamp(+(value + step).toFixed(2), min, max))}
        />
      </View>
    </Card.Content>
  </Card>
);

export const SpeechSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const speech = useSettingsStore(s => s.settings.speech);
  const language = useSettingsStore(s => s.settings.language);
  const setRate = useSettingsStore(s => s.setSpeechRate);
  const setPitch = useSettingsStore(s => s.setSpeechPitch);

  const test = () =>
    getTts().speak(
      language === 'en' ? 'Hello, this is a test' : 'Xin chào, đây là giọng thử',
      language === 'en' ? 'en-US' : 'vi-VN',
    );

  return (
    <View style={styles.container}>
      <Stepper
        label={t('settings.rate')}
        value={speech.rate}
        min={0.1}
        max={1.0}
        step={0.05}
        onChange={setRate}
      />
      <Stepper
        label={t('settings.pitch')}
        value={speech.pitch}
        min={0.5}
        max={2.0}
        step={0.1}
        onChange={setPitch}
      />
      <Button mode="contained" icon="volume-high" onPress={test} style={styles.test}>
        {t('board.speakSentence')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 12},
  card: {marginBottom: 12},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepper: {flexDirection: 'row', alignItems: 'center'},
  value: {minWidth: 56, textAlign: 'center'},
  test: {marginTop: 12},
});
