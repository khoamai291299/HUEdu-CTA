/**
 * src/presentation/navigation/MainTabNavigator.tsx
 * Mục đích: Tab dưới cho chế độ trẻ dùng: Bảng giao tiếp + Yêu thích.
 * Dependency: bottom-tabs, screens, lucide, i18n.
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MessageSquare, SplitSquareHorizontal, Clock, Star} from 'lucide-react-native';
import {useTheme} from 'react-native-paper';
import {ImageBackground, StyleSheet} from 'react-native';
import {MainTabParamList} from './types';
import {DirectCommunicationBoardScreen} from '@presentation/screens/DirectCommunicationBoardScreen';
import {CommunicationBoardScreen} from '@presentation/screens/CommunicationBoardScreen';
import {DirectCommonScreen} from '@presentation/screens/DirectCommonScreen';
import {FavoritesScreen} from '@presentation/screens/FavoritesScreen';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabParamList>();

const FOREST_BG = require('../../assets/images/forest.jpg');
const OCEAN_BG = require('../../assets/images/ocean.jpg');

export const MainTabNavigator: React.FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const appTheme = useSettingsStore(s => s.settings.theme);

  let bgSource: any;
  if (appTheme === 'forest') bgSource = FOREST_BG;
  if (appTheme === 'ocean') bgSource = OCEAN_BG;

  return (
    <Tab.Navigator
      initialRouteName="DirectBoard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
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
        name="Board"
        component={CommunicationBoardScreen}
        options={{
          tabBarLabel: t('tabs.board') || 'Ghép câu',
          tabBarIcon: ({color, size}) => (
            <SplitSquareHorizontal color={color} size={size} />
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
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: t('tabs.favorites') || 'Yêu thích',
          tabBarIcon: ({color, size}) => <Star color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
