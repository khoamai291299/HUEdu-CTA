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
  Clock,
  Database,
  Palette,
  Settings2,
  Sliders,
  Users,
  Volume2,
  ChartColumn,
  Activity,
  Lightbulb,
  Play,
} from 'lucide-react-native';
import { SettingsScreenProps } from '@presentation/navigation/types';
import { useTheme } from 'react-native-paper';

export const SettingsHomeScreen: React.FC<
  SettingsScreenProps<'SettingsHome'>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
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
        {item(<Play size={24} color={theme.colors.primary} />, 'Cài đặt Bước 1 (1 thẻ)', () =>
          navigation.navigate('Pecs'),
        )}
        {item(<Activity size={24} color={theme.colors.onSurface} />, t('settings.activity'), () =>
          navigation.navigate('ActivityList'),
        )}
        {item(<Lightbulb size={24} color={theme.colors.primary} />, 'Mẹo giúp bé tập trung', () =>
          navigation.navigate('FocusTips', { isFromOnboarding: false }),
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
        {item(<Users size={24} color={theme.colors.onSurface} />, t('settings.profiles'), () =>
          navigation.navigate('ChildProfiles'),
        )}
        {item(<ChartColumn size={24} color={theme.colors.onSurface} />, t('settings.stats'), () =>
          navigation.navigate('StatisticsDashboard'),
        )}
        {item(<Clock size={24} color={theme.colors.onSurface} />, t('settings.history'), () =>
          navigation.navigate('UsageHistory'),
        )}
      </List.Section>
      <Divider />
      <List.Section>
        {item(<Volume2 size={24} color={theme.colors.onSurface} />, t('settings.voice'), () =>
          navigation.navigate('VoiceSettings'),
        )}
        {item(<Sliders size={24} color={theme.colors.onSurface} />, t('settings.speech'), () =>
          navigation.navigate('SpeechSettings'),
        )}
        {item(<Palette size={24} color={theme.colors.onSurface} />, t('settings.themeLang'), () =>
          navigation.navigate('ThemeLanguage'),
        )}
        {item(<Database size={24} color={theme.colors.onSurface} />, t('settings.backup'), () =>
          navigation.navigate('BackupRestore'),
        )}
      </List.Section>
      <Divider />
      <List.Item
        title="HUEdu-CTA v1.6.0"
        left={() => <List.Icon icon={() => <Settings2 size={24} color={theme.colors.onSurface} />} />}
      />
    </ScrollView>
  );
};
