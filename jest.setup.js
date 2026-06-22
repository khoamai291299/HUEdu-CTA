/**
 * jest.setup.js
 * Mục đích: Thiết lập mock cho môi trường test (native modules không chạy trong Jest).
 */
/* eslint-disable no-undef */
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(() => Promise.resolve('success')),
  speak: jest.fn(() => Promise.resolve('1')),
  stop: jest.fn(() => Promise.resolve(true)),
  setDefaultRate: jest.fn(() => Promise.resolve(true)),
  setDefaultPitch: jest.fn(() => Promise.resolve(true)),
  setDefaultLanguage: jest.fn(() => Promise.resolve(true)),
  setDefaultVoice: jest.fn(() => Promise.resolve(true)),
  voices: jest.fn(() => Promise.resolve([])),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
