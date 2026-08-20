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
  /** Màn hình 1 của luồng PECS: chọn chế độ Phụ huynh / Trẻ. */
  ModeSelect: undefined;
  Main: undefined;
  Settings: undefined;
  FocusTips: { isFromOnboarding?: boolean };
  /** Luồng thiết lập + Dashboard Admin của Bước 1 PECS. */
  Pecs: undefined;
  /** Chế độ trẻ của Bước 1 PECS (toàn màn hình, không thanh điều hướng). */
  PecsChild: undefined;
};

export type PecsStackParamList = {
  PecsChildName: undefined;
  PecsThemeColor: undefined;
  PecsVoice: undefined;
  PecsCommAssess: undefined;
  PecsMotorAssess: undefined;
  PecsRewardPick: undefined;
  PecsFirstCard: undefined;
  PecsPinSetup: undefined;
  PecsHandoff: undefined;
  PecsDashboard: undefined;
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
  CreateCard: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SettingsStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type PecsScreenProps<T extends keyof PecsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<PecsStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
