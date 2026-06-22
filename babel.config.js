/**
 * babel.config.js
 * Mục đích: Cấu hình Babel cho React Native.
 * LƯU Ý QUAN TRỌNG: plugin 'react-native-reanimated/plugin' BẮT BUỘC đặt CUỐI CÙNG.
 * Dependency: @react-native/babel-preset, react-native-reanimated.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@core': './src/core',
          '@domain': './src/domain',
          '@data': './src/data',
          '@presentation': './src/presentation',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
