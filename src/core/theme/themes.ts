/**
 * src/core/theme/themes.ts
 * Mục đích: Định nghĩa Light/Dark theme (Material 3) cho React Native Paper,
 *           dùng tông màu nhẹ nhàng, dịu mắt phù hợp trẻ tự kỷ.
 * Dependency: react-native-paper.
 */
import {MD3DarkTheme, MD3LightTheme, MD3Theme} from 'react-native-paper';

export type AppThemeName = 'light' | 'dark' | 'forest' | 'ocean';

const softColors = {
  primary: '#5B8DEF',
  secondary: '#7BD0C1',
  tertiary: '#F2B5A0',
  error: '#E07A6E',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: softColors.primary,
    secondary: softColors.secondary,
    tertiary: softColors.tertiary,
    error: softColors.error,
    background: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2F7',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9CC0FF',
    secondary: '#8FE3D4',
    tertiary: '#F7C9B8',
    error: '#F2A097',
    background: '#121417',
    surface: '#1B1F24',
    surfaceVariant: '#262B31',
  },
};

export const forestTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    secondary: '#81C784',
    tertiary: '#AEEA00',
    error: '#D32F2F',
    background: '#E8F5E9',
    surface: '#FFFFFF',
    surfaceVariant: '#C8E6C9',
  },
};

export const oceanTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0277BD',
    secondary: '#4FC3F7',
    tertiary: '#00BCD4',
    error: '#D32F2F',
    background: '#E1F5FE',
    surface: '#FFFFFF',
    surfaceVariant: '#B3E5FC',
  },
};

export const getTheme = (name: AppThemeName): MD3Theme => {
  switch (name) {
    case 'dark':
      return darkTheme;
    case 'forest':
      return forestTheme;
    case 'ocean':
      return oceanTheme;
    case 'light':
    default:
      return lightTheme;
  }
};
