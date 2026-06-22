/**
 * metro.config.js
 * Mục đích: Cấu hình Metro bundler mặc định của React Native.
 * Dependency: @react-native/metro-config.
 */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
