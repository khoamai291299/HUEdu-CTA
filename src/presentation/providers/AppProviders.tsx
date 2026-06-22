/**
 * src/presentation/providers/AppProviders.tsx
 * Mục đích: Gom tất cả Provider gốc: GestureHandler, SafeArea, Paper (theme),
 *           NavigationContainer (đồng bộ theme sáng/tối với Paper).
 * Dependency: gesture-handler, safe-area-context, react-native-paper, react-navigation,
 *             useAppTheme.
 */
import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  NavigationContainer,
  Theme as NavTheme,
} from '@react-navigation/native';
import {useAppTheme} from '@presentation/hooks/useAppTheme';

export const AppProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const theme = useAppTheme();
  const isDark = theme.dark;

  const navBase = isDark ? NavDark : NavLight;
  const navTheme: NavTheme = {
    ...navBase,
    colors: {
      ...navBase.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background, // Match screen background
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
      notification: theme.colors.error,
    },
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <NavigationContainer theme={navTheme}>
            {children}
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
