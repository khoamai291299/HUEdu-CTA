/**
 * src/presentation/navigation/MainTabNavigator.tsx
 * Mục đích: Tab dưới cho chế độ trẻ dùng: Bảng giao tiếp + Yêu thích.
 * Dependency: bottom-tabs, screens, lucide, i18n.
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MessageSquare, Clock} from 'lucide-react-native';
import {useTheme} from 'react-native-paper';

import {MainTabParamList} from './types';
import {DirectCommunicationBoardScreen} from '@presentation/screens/DirectCommunicationBoardScreen';
import {DirectCommonScreen} from '@presentation/screens/DirectCommonScreen';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabParamList>();

import {RootScreenProps} from './types';

export const MainTabNavigator: React.FC<RootScreenProps<'Main'>> = () => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="DirectBoard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.outlineVariant,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="DirectBoard"
        component={DirectCommunicationBoardScreen}
        options={{
          tabBarLabel: t('tabs.directBoard') || 'Giao tiếp',
          tabBarIcon: ({color, size}) => (
            <MessageSquare color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DirectCommon"
        component={DirectCommonScreen}
        options={{
          tabBarLabel: t('tabs.common') || 'Thường dùng',
          tabBarIcon: ({color, size}) => <Clock color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
