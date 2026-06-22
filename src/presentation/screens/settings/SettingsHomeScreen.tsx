/**
 * src/presentation/screens/settings/SettingsHomeScreen.tsx
 * Mục đích: Menu Cài đặt - điều hướng tới 11 mục quản lý/cấu hình.
 * Dependency: react-native-paper List, lucide, i18n, SettingsScreenProps.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {
  BookA,
  Clock,
  Database,

  Palette,
  Settings2,
  Sliders,
  Users,
  Volume2,
  ChartColumn,
  Activity,
} from 'lucide-react-native';
import { SettingsScreenProps } from '@presentation/navigation/types';

export const SettingsHomeScreen: React.FC<
  SettingsScreenProps<'SettingsHome'>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const item = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
  ) => (
    <List.Item
      title={title}
      left={() => <List.Icon icon={() => icon} />}
      right={() => <List.Icon icon="chevron-right" />}
      onPress={onPress}
    />
  );

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <List.Section>
        {item(<Activity size={24} />, t('settings.activity'), () =>
          navigation.navigate('ActivityList'),
        )}
      </List.Section>
      {/* Tạm ẩn Quản lý từ vựng
      <Divider />
      <List.Section>
        {item(<BookA size={24} />, t('settings.vocabulary'), () =>
          navigation.navigate('VocabularyList'),
        )}
      </List.Section>
      */}
      <Divider />
      <List.Section>
        {item(<Users size={24} />, t('settings.profiles'), () =>
          navigation.navigate('ChildProfiles'),
        )}
        {item(<ChartColumn size={24} />, t('settings.stats'), () =>
          navigation.navigate('StatisticsDashboard'),
        )}
        {item(<Clock size={24} />, t('settings.history'), () =>
          navigation.navigate('UsageHistory'),
        )}
      </List.Section>
      <Divider />
      <List.Section>
        {item(<Volume2 size={24} />, t('settings.voice'), () =>
          navigation.navigate('VoiceSettings'),
        )}
        {item(<Sliders size={24} />, t('settings.speech'), () =>
          navigation.navigate('SpeechSettings'),
        )}
        {item(<Palette size={24} />, t('settings.themeLang'), () =>
          navigation.navigate('ThemeLanguage'),
        )}
        {item(<Database size={24} />, t('settings.backup'), () =>
          navigation.navigate('BackupRestore'),
        )}
      </List.Section>
      <Divider />
      <List.Item
        title="HUEdu-CTA v1.0.0"
        left={() => <List.Icon icon={() => <Settings2 size={24} />} />}
      />
    </ScrollView>
  );
};
