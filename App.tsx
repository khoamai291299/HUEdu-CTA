/**
 * App.tsx
 * Mục đích: Component gốc của ứng dụng - ráp Provider + điều hướng gốc.
 *           Bootstrap thực tế (DI, DB, settings, TTS) chạy trong SplashScreen.
 * Dependency: AppProviders, RootNavigator.
 */
import React from 'react';
import {AppProviders} from '@presentation/providers/AppProviders';
import {RootNavigator} from '@presentation/navigation/RootNavigator';

const App: React.FC = () => (
  <AppProviders>
    <RootNavigator />
  </AppProviders>
);

export default App;
