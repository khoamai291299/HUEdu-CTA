import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingStackParamList, RootScreenProps} from './types';
import {SkinToneScreen} from '@presentation/screens/onboarding/SkinToneScreen';
import {RegionScreen} from '@presentation/screens/onboarding/RegionScreen';
import {DiagnosisScreen} from '@presentation/screens/onboarding/DiagnosisScreen';
import {BirthYearScreen} from '@presentation/screens/onboarding/BirthYearScreen';
import {ThemeColorScreen} from '@presentation/screens/onboarding/ThemeColorScreen';
import {VoiceScreen} from '@presentation/screens/onboarding/VoiceScreen';
import {UsernameScreen} from '@presentation/screens/onboarding/UsernameScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC<RootScreenProps<'Onboarding'>> = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SkinTone" component={SkinToneScreen} />
      <Stack.Screen name="Region" component={RegionScreen} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
      <Stack.Screen name="BirthYear" component={BirthYearScreen} />
      <Stack.Screen name="ThemeColor" component={ThemeColorScreen} />
      <Stack.Screen name="Voice" component={VoiceScreen} />
      <Stack.Screen name="Username" component={UsernameScreen} />
    </Stack.Navigator>
  );
};
