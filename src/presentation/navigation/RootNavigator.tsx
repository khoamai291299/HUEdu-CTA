/**
 * src/presentation/navigation/RootNavigator.tsx
 * Mục đích: Điều hướng gốc: Splash -> Main (tab trẻ dùng) -> ParentGate -> Settings.
 * Dependency: native-stack, navigators, screens.
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {MainTabNavigator} from './MainTabNavigator';
import {SettingsNavigator} from './SettingsNavigator';
import {SplashScreen} from '@presentation/screens/SplashScreen';
import {LoginScreen} from '@presentation/screens/LoginScreen';
import {ParentGateScreen} from '@presentation/screens/ParentGateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Main" component={MainTabNavigator} />
    <Stack.Screen
      name="ParentGate"
      component={ParentGateScreen}
      options={{presentation: 'modal'}}
    />
    <Stack.Screen name="Settings" component={SettingsNavigator} />
  </Stack.Navigator>
);
