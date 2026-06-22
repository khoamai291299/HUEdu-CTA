/**
 * src/presentation/navigation/types.ts
 * Mục đích: Khai báo ParamList type-safe cho toàn bộ navigation (React Navigation v7).
 * Dependency: @react-navigation/native-stack, bottom-tabs.
 */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Settings: undefined;
};

export type OnboardingStackParamList = {
  SkinTone: undefined;
  Region: undefined;
  Diagnosis: undefined;
  BirthYear: undefined;
  ThemeColor: undefined;
  Voice: undefined;
  Username: undefined;
};

export type MainTabParamList = {
  DirectBoard: undefined;
  DirectCommon: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  VocabularyList: undefined;
  VocabularyEdit: {id?: number};
  ActivityList: undefined;
  ActivityEdit: {id?: number};
  ChildProfiles: undefined;
  ChildProfileEdit: {id?: number} | undefined;
  StatisticsDashboard: undefined;
  UsageHistory: undefined;
  VoiceSettings: undefined;
  SpeechSettings: undefined;
  ThemeLanguage: undefined;
  BackupRestore: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> =
  NativeStackScreenProps<SettingsStackParamList, T>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
