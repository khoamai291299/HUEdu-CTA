/**
 * src/core/errors/GlobalErrorHandler.ts
 * Mục đích: Bắt các lỗi JS không được xử lý ở mức toàn cục để log & tránh crash im lặng.
 *           Dùng kèm ErrorBoundary (tầng UI) cho lỗi render.
 * Dependency: logger.
 */
import {logger} from '@core/utils/logger';

type RNErrorUtils = {
  setGlobalHandler: (cb: (error: Error, isFatal?: boolean) => void) => void;
  getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
};

declare const ErrorUtils: RNErrorUtils | undefined;

export class GlobalErrorHandler {
  private static installed = false;

  static install(): void {
    if (GlobalErrorHandler.installed) {
      return;
    }
    GlobalErrorHandler.installed = true;

    if (typeof ErrorUtils !== 'undefined') {
      const previous = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        logger.error('[GlobalError]', {message: error?.message, isFatal});
        previous?.(error, isFatal);
      });
    }
  }
}
