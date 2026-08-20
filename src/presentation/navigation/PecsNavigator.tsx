/**
 * src/presentation/navigation/PecsNavigator.tsx
 * Mục đích: Stack cho Bước 1 PECS — luồng thiết lập 9 bước (cũng đóng vai trò
 *           onboarding lần đầu) và Dashboard Admin.
 *           Chưa thiết lập -> chạy wizard từ bước 1; đã thiết lập -> vào Dashboard.
 * Dependency: native-stack, các màn pecs/*, usePecsStore.
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PecsStackParamList, RootScreenProps} from './types';
import {PecsChildNameScreen} from '@presentation/screens/pecs/PecsChildNameScreen';
import {PecsThemeColorScreen} from '@presentation/screens/pecs/PecsThemeColorScreen';
import {PecsVoiceScreen} from '@presentation/screens/pecs/PecsVoiceScreen';
import {PecsCommAssessScreen} from '@presentation/screens/pecs/PecsCommAssessScreen';
import {PecsMotorAssessScreen} from '@presentation/screens/pecs/PecsMotorAssessScreen';
import {PecsRewardPickScreen} from '@presentation/screens/pecs/PecsRewardPickScreen';
import {PecsFirstCardScreen} from '@presentation/screens/pecs/PecsFirstCardScreen';
import {PecsPinSetupScreen} from '@presentation/screens/pecs/PecsPinSetupScreen';
import {PecsHandoffScreen} from '@presentation/screens/pecs/PecsHandoffScreen';
import {PecsAdminDashboardScreen} from '@presentation/screens/pecs/PecsAdminDashboardScreen';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

const Stack = createNativeStackNavigator<PecsStackParamList>();

export const PecsNavigator: React.FC<RootScreenProps<'Pecs'>> = () => {
  const setupDone = usePecsStore(s => s.config.setupDone);
  const isOnboarded = useSettingsStore(s => s.settings.isOnboarded);
  const startAtDashboard = setupDone && isOnboarded;

  return (
    <Stack.Navigator
      initialRouteName={startAtDashboard ? 'PecsDashboard' : 'PecsChildName'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="PecsDashboard" component={PecsAdminDashboardScreen} />
      <Stack.Screen name="PecsChildName" component={PecsChildNameScreen} />
      <Stack.Screen name="PecsThemeColor" component={PecsThemeColorScreen} />
      <Stack.Screen name="PecsVoice" component={PecsVoiceScreen} />
      <Stack.Screen name="PecsCommAssess" component={PecsCommAssessScreen} />
      <Stack.Screen name="PecsMotorAssess" component={PecsMotorAssessScreen} />
      <Stack.Screen name="PecsRewardPick" component={PecsRewardPickScreen} />
      <Stack.Screen name="PecsFirstCard" component={PecsFirstCardScreen} />
      <Stack.Screen name="PecsPinSetup" component={PecsPinSetupScreen} />
      <Stack.Screen name="PecsHandoff" component={PecsHandoffScreen} />
    </Stack.Navigator>
  );
};
