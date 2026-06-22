/**
 * src/core/utils/logger.ts
 * Mục đích: Logger tối giản, tập trung. Ở production có thể tắt log debug.
 * Dependency: __DEV__ (RN global).
 */
declare const __DEV__: boolean;

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export const logger = {
  debug: (...args: unknown[]): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.error('[ERROR]', ...args);
  },
};
