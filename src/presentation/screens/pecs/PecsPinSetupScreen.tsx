/**
 * src/presentation/screens/pecs/PecsPinSetupScreen.tsx
 * Mục đích: Màn 8 — Thiết lập Bảo mật (Gatekeeper). Bắt buộc có mã PIN 4 số trước
 *           khi giao thiết bị cho trẻ. Nhập PIN rồi xác nhận lại.
 * Dependency: PinPad (dùng lại), useSettingsStore, PecsProgressBar.
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Lock} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {PinPad} from '@presentation/components/PinPad';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {Defaults} from '@core/constants';

type Phase = 'enter' | 'confirm';

export const PecsPinSetupScreen: React.FC<
  PecsScreenProps<'PecsPinSetup'>
> = ({navigation}) => {
  const theme = useTheme();
  const setParentPin = useSettingsStore(s => s.setParentPin);
  const existingPin = useSettingsStore(s => s.settings.parentPin);

  const [phase, setPhase] = useState<Phase>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (value.length !== Defaults.PIN_LENGTH) {
      return;
    }

    if (phase === 'enter') {
      setFirstPin(value);
      setValue('');
      setError(null);
      setPhase('confirm');
      return;
    }

    if (value !== firstPin) {
      setError('Hai lần nhập chưa khớp. Ba mẹ thử lại từ đầu nhé.');
      setFirstPin('');
      setValue('');
      setPhase('enter');
      return;
    }

    setSaving(true);
    setParentPin(value)
      .then(() => navigation.navigate('PecsHandoff'))
      .catch(() => {
        setError('Không lưu được mã PIN. Ba mẹ thử lại giúp nhé.');
        setSaving(false);
        setValue('');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const title =
    phase === 'enter' ? 'Nhập mã PIN 4 số của ba mẹ' : 'Xác nhận lại mã PIN';

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={8} label="Bảo mật" />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.iconBox,
            {backgroundColor: theme.colors.primaryContainer},
          ]}>
          <Lock size={36} color={theme.colors.primary} />
        </View>

        <Text variant="headlineSmall" style={styles.question}>
          Để bé tập trung và không vô tình thoát ra ngoài, hãy thiết lập mã PIN 4
          số của ba mẹ.
        </Text>

        <Text variant="titleMedium" style={styles.phaseLabel}>
          {title}
        </Text>

        {existingPin && phase === 'enter' ? (
          <Text
            variant="bodySmall"
            style={[styles.note, {color: theme.colors.onSurfaceVariant}]}>
            Ba mẹ đã có mã PIN. Nhập mã mới để thay thế mã cũ.
          </Text>
        ) : null}

        {error ? (
          <Text style={[styles.error, {color: theme.colors.error}]}>
            {error}
          </Text>
        ) : null}

        <PinPad value={value} onChange={setValue} />
      </ScrollView>

      <View style={styles.footer}>
        <Button disabled={saving} onPress={() => navigation.goBack()}>
          Quay lại
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center'},
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  question: {fontWeight: '800', textAlign: 'center', marginBottom: 20},
  phaseLabel: {fontWeight: '700', marginBottom: 6},
  note: {textAlign: 'center', marginBottom: 8, fontStyle: 'italic'},
  error: {textAlign: 'center', marginBottom: 8},
  footer: {paddingHorizontal: 24, paddingBottom: 16, paddingTop: 4},
});
