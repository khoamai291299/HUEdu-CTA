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
  Login: undefined;
  Main: undefined;
  ParentGate: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  DirectBoard: undefined;
  Board: undefined;
  DirectCommon: undefined;
  Favorites: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  VocabularyList: undefined;
  VocabularyEdit: {id?: number};
  VocabularyCategoryManagement: undefined;
  ActivityList: undefined;
  ActivityEdit: {id?: number};
  ActivityCategoryManagement: undefined;
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
