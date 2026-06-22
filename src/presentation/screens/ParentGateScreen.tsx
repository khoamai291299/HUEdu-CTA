/**
 * src/presentation/screens/ParentGateScreen.tsx
 * Mục đích: Cổng phụ huynh - tạo PIN lần đầu hoặc xác minh PIN để vào Cài đặt (FR-09).
 * Dependency: PinUseCases, PinPad, services DI, constants, i18n, RootScreenProps.
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {PinPad} from '@presentation/components/PinPad';
import {
  IsPinSetUseCase,
  SetPinUseCase,
  VerifyPinUseCase,
} from '@domain/usecases/auth/PinUseCases';
import {getSettingsRepo} from '@presentation/di/services';
import {Defaults} from '@core/constants';
import {RootScreenProps} from '@presentation/navigation/types';

export const ParentGateScreen: React.FC<RootScreenProps<'ParentGate'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    new IsPinSetUseCase(getSettingsRepo())
      .execute()
      .then(set => setIsSetup(!set));
  }, []);

  useEffect(() => {
    const submit = async () => {
      if (pin.length !== Defaults.PIN_LENGTH || isSetup == null) {
        return;
      }
      if (isSetup) {
        await new SetPinUseCase(getSettingsRepo()).execute(pin);
        navigation.replace('Settings');
        return;
      }
      const ok = await new VerifyPinUseCase(getSettingsRepo()).execute(pin);
      if (ok) {
        navigation.replace('Settings');
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setError(
          next >= Defaults.MAX_PIN_ATTEMPTS
            ? t('pin.tooManyAttempts')
            : t('pin.wrong'),
        );
        setPin('');
      }
    };
    submit();
  }, [pin, isSetup, attempts, navigation, t]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isSetup ? t('pin.setup') : t('pin.enter')} />
      </Appbar.Header>

      <View style={styles.body}>
        <Text variant="titleLarge" style={styles.prompt}>
          {isSetup ? t('pin.setup') : t('pin.enter')}
        </Text>
        {error ? (
          <Text style={[styles.error, {color: theme.colors.error}]}>
            {error}
          </Text>
        ) : null}
        <PinPad
          value={pin}
          onChange={setPin}
          length={Defaults.PIN_LENGTH}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  prompt: {marginBottom: 8},
  error: {marginBottom: 16},
});
