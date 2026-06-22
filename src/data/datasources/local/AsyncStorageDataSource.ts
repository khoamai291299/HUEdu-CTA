/**
 * src/data/datasources/local/AsyncStorageDataSource.ts
 * Mục đích: Bọc AsyncStorage cho cache nhẹ (cờ onboarding, theme cache khởi động nhanh).
 *           Nguồn chân lý cấu hình vẫn là bảng settings; đây chỉ là cache.
 * Dependency: @react-native-async-storage/async-storage, logger.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '@core/utils/logger';

export class AsyncStorageDataSource {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      logger.warn('[AsyncStorage] get failed', key, e);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      logger.warn('[AsyncStorage] set failed', key, e);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      logger.warn('[AsyncStorage] remove failed', key, e);
    }
  }
}
