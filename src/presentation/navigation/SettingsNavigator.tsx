/**
 * src/presentation/navigation/SettingsNavigator.tsx
 * Mục đích: Stack các màn cấu hình (sau khi qua Parent Gate) - 12 màn (FR-04..15).
 * Dependency: native-stack, settings screens, i18n.
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Appbar, useTheme} from 'react-native-paper';
import {SettingsStackParamList, RootScreenProps} from './types';
import {SettingsHomeScreen} from '@presentation/screens/settings/SettingsHomeScreen';
import {VocabularyListScreen} from '@presentation/screens/settings/VocabularyListScreen';
import {VocabularyEditScreen} from '@presentation/screens/settings/VocabularyEditScreen';
import {ActivityListScreen} from '@presentation/screens/settings/ActivityListScreen';
import {ActivityEditScreen} from '@presentation/screens/settings/ActivityEditScreen';
import {ChildProfilesScreen} from '@presentation/screens/settings/ChildProfilesScreen';
import {ChildProfileEditScreen} from '@presentation/screens/settings/ChildProfileEditScreen';
import {StatisticsDashboardScreen} from '@presentation/screens/settings/StatisticsDashboardScreen';
import {UsageHistoryScreen} from '@presentation/screens/settings/UsageHistoryScreen';
import {VoiceSettingsScreen} from '@presentation/screens/settings/VoiceSettingsScreen';
import {SpeechSettingsScreen} from '@presentation/screens/settings/SpeechSettingsScreen';
import {ThemeLanguageScreen} from '@presentation/screens/settings/ThemeLanguageScreen';
import {BackupRestoreScreen} from '@presentation/screens/settings/BackupRestoreScreen';
import {CreateCardScreen} from '@presentation/screens/settings/CreateCardScreen';
const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator: React.FC<RootScreenProps<'Settings'>> = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({navigation, route, options, back}) => {
          const title = options.title !== undefined ? options.title : route.name;
          return (
            <Appbar.Header style={{backgroundColor: 'transparent'}}>
              {back ? (
                <Appbar.BackAction onPress={navigation.goBack} />
              ) : (
                <Appbar.BackAction onPress={() => navigation.getParent()?.goBack() || navigation.goBack()} />
              )}
              <Appbar.Content title={title as string} />
            </Appbar.Header>
          );
        },
      }}>
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{title: t('settings.title')}}
      />
      <Stack.Screen
        name="VocabularyList"
        component={VocabularyListScreen}
        options={{title: t('settings.vocabulary')}}
      />
      <Stack.Screen
        name="VocabularyEdit"
        component={VocabularyEditScreen}
        options={{title: 'Chỉnh sửa từ vựng'}}
      />

      <Stack.Screen
        name="ActivityList"
        component={ActivityListScreen}
        options={{title: t('settings.activity')}}
      />
      <Stack.Screen
        name="ActivityEdit"
        component={ActivityEditScreen}
        options={{title: 'Chỉnh sửa hoạt động'}}
      />
      <Stack.Screen
        name="ChildProfiles"
        component={ChildProfilesScreen}
        options={{title: t('settings.profiles')}}
      />
      <Stack.Screen
        name="ChildProfileEdit"
        component={ChildProfileEditScreen}
        options={{title: t('profiles.title')}}
      />
      <Stack.Screen
        name="StatisticsDashboard"
        component={StatisticsDashboardScreen}
        options={{title: t('settings.stats')}}
      />
      <Stack.Screen
        name="UsageHistory"
        component={UsageHistoryScreen}
        options={{title: t('settings.history')}}
      />
      <Stack.Screen
        name="VoiceSettings"
        component={VoiceSettingsScreen}
        options={{title: t('settings.voice')}}
      />
      <Stack.Screen
        name="SpeechSettings"
        component={SpeechSettingsScreen}
        options={{title: t('settings.speech')}}
      />
      <Stack.Screen
        name="ThemeLanguage"
        component={ThemeLanguageScreen}
        options={{title: t('settings.themeLang')}}
      />
      <Stack.Screen
        name="BackupRestore"
        component={BackupRestoreScreen}
        options={{title: t('settings.backup')}}
      />
      <Stack.Screen
        name="CreateCard"
        component={CreateCardScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
