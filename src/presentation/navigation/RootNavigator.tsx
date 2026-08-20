/**
 * src/presentation/navigation/RootNavigator.tsx
 * Mục đích: Điều hướng gốc: Splash -> (lần đầu) wizard PECS 9 bước -> ModeSelect
 *           -> Main / PecsChild / Settings.
 * Dependency: native-stack, navigators, screens.
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {MainTabNavigator} from './MainTabNavigator';
import {SettingsNavigator} from './SettingsNavigator';
import {SplashScreen} from '@presentation/screens/SplashScreen';
import {FocusTipsScreen} from '@presentation/screens/FocusTipsScreen';
import {ModeSelectScreen} from '@presentation/screens/ModeSelectScreen';
import {PecsNavigator} from './PecsNavigator';
import {PecsChildScreen} from '@presentation/screens/pecs/PecsChildScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Main" component={MainTabNavigator} />
    <Stack.Screen name="Settings" component={SettingsNavigator} />
    <Stack.Screen name="FocusTips" component={FocusTipsScreen} />
    <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
    <Stack.Screen name="Pecs" component={PecsNavigator} />
    <Stack.Screen
      name="PecsChild"
      component={PecsChildScreen}
      options={{gestureEnabled: false}}
    />
  </Stack.Navigator>
);
