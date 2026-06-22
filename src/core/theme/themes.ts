/**
 * src/core/theme/themes.ts
 * Mục đích: Định nghĩa Light/Dark theme (Material 3) cho React Native Paper,
 *           dùng tông màu nhẹ nhàng, dịu mắt phù hợp trẻ tự kỷ.
 * Dependency: react-native-paper.
 */
import {MD3DarkTheme, MD3LightTheme, MD3Theme} from 'react-native-paper';

export type AppThemeName = 'light' | 'dark' | 'forest' | 'ocean' | 'pale' | 'pink' | 'green' | 'lavender' | 'peach' | 'mint' | 'sky' | 'lemon' | 'rose' | 'sand';

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
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2F7',
    primaryContainer: '#7BD0C1',
    secondaryContainer: '#7BD0C1',
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
    primaryContainer: '#8FE3D4',
    secondaryContainer: '#8FE3D4',
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
    primaryContainer: '#81C784',
    secondaryContainer: '#81C784',
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
    primaryContainer: '#4FC3F7',
    secondaryContainer: '#4FC3F7',
  },
};

export const paleTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5B8DEF',
    secondary: '#89CFF0',
    background: '#D4E6F1',
    surface: '#FFFFFF',
    surfaceVariant: '#EAF2F8',
    primaryContainer: '#89CFF0',
    secondaryContainer: '#89CFF0',
    onSurface: '#2C3E50',
    outline: '#A9CCE3',
  },
};

export const pinkTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E74C3C',
    secondary: '#F5B7B1',
    background: '#FADBD8',
    surface: '#FFFFFF',
    surfaceVariant: '#FDEDEC',
    primaryContainer: '#F5B7B1',
    secondaryContainer: '#F5B7B1',
    onSurface: '#641E16',
    outline: '#F5B7B1',
  },
};

export const greenTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#27AE60',
    secondary: '#A9DFBF',
    background: '#D5F5E3',
    surface: '#FFFFFF',
    surfaceVariant: '#EAFAF1',
    primaryContainer: '#A9DFBF',
    secondaryContainer: '#A9DFBF',
    onSurface: '#145A32',
    outline: '#A9DFBF',
  },
};

export const lavenderTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8E44AD',
    secondary: '#D2B4DE',
    background: '#E8DAEF',
    surface: '#FFFFFF',
    surfaceVariant: '#F4ECF7',
    primaryContainer: '#D2B4DE',
    secondaryContainer: '#D2B4DE',
    onSurface: '#4A235A',
    outline: '#D2B4DE',
  },
};

export const peachTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#D35400',
    secondary: '#F5CBA7',
    background: '#FAD7A1',
    surface: '#FFFFFF',
    surfaceVariant: '#FDEBD0',
    primaryContainer: '#F5CBA7',
    secondaryContainer: '#F5CBA7',
    onSurface: '#6E2C00',
    outline: '#F5CBA7',
  },
};

export const mintTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1ABC9C',
    secondary: '#A3E4D7',
    background: '#D1F2EB',
    surface: '#FFFFFF',
    surfaceVariant: '#E8F8F5',
    primaryContainer: '#A3E4D7',
    secondaryContainer: '#A3E4D7',
    onSurface: '#0E6251',
    outline: '#A3E4D7',
  },
};

export const skyTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2980B9',
    secondary: '#AED6F1',
    background: '#D6EAF8',
    surface: '#FFFFFF',
    surfaceVariant: '#EBF5FB',
    primaryContainer: '#AED6F1',
    secondaryContainer: '#AED6F1',
    onSurface: '#154360',
    outline: '#AED6F1',
  },
};

export const lemonTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#F1C40F',
    secondary: '#F9E79F',
    background: '#FCF3CF',
    surface: '#FFFFFF',
    surfaceVariant: '#FEF9E7',
    primaryContainer: '#F9E79F',
    secondaryContainer: '#F9E79F',
    onSurface: '#7D6608',
    outline: '#F9E79F',
  },
};

export const roseTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#C0392B',
    secondary: '#F1948A',
    background: '#F5B7B1',
    surface: '#FFFFFF',
    surfaceVariant: '#FDEDEC',
    primaryContainer: '#F1948A',
    secondaryContainer: '#F1948A',
    onSurface: '#641E16',
    outline: '#F1948A',
  },
};

export const sandTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#935116',
    secondary: '#E59866',
    background: '#EDBB99',
    surface: '#FFFFFF',
    surfaceVariant: '#F6DDCC',
    primaryContainer: '#E59866',
    secondaryContainer: '#E59866',
    onSurface: '#4E2C0B',
    outline: '#E59866',
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
    case 'pale':
      return paleTheme;
    case 'pink':
      return pinkTheme;
    case 'green':
      return greenTheme;
    case 'lavender':
      return lavenderTheme;
    case 'peach':
      return peachTheme;
    case 'mint':
      return mintTheme;
    case 'sky':
      return skyTheme;
    case 'lemon':
      return lemonTheme;
    case 'rose':
      return roseTheme;
    case 'sand':
      return sandTheme;
    case 'light':
    default:
      return lightTheme;
  }
};

