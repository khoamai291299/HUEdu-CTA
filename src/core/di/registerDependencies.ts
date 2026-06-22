/**
 * src/core/di/registerDependencies.ts
 * Mục đích: "Composition Root" - nơi DUY NHẤT nối các implementation cụ thể vào DI container.
 *           Tầng presentation chỉ resolve theo token, không biết lớp cụ thể (DIP).
 *           Đổi MockTtsService <-> LocalTtsService chỉ sửa một dòng tại đây (rủi ro R2).
 * Dependency: Container, tokens, toàn bộ implementation tầng data.
 */
import {Container} from './Container';
import {TOKENS} from './tokens';

import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseService} from '@data/datasources/sqlite/DatabaseService';
import {AsyncStorageDataSource} from '@data/datasources/local/AsyncStorageDataSource';

import {CategoryRepositoryImpl} from '@data/repositories/CategoryRepositoryImpl';
import {VocabularyRepositoryImpl} from '@data/repositories/VocabularyRepositoryImpl';
import {ActivityCategoryRepositoryImpl} from '@data/repositories/ActivityCategoryRepositoryImpl';
import {ActivityRepositoryImpl} from '@data/repositories/ActivityRepositoryImpl';
import {ChildRepositoryImpl} from '@data/repositories/ChildRepositoryImpl';
import {FavoriteRepositoryImpl} from '@data/repositories/FavoriteRepositoryImpl';
import {UsageHistoryRepositoryImpl} from '@data/repositories/UsageHistoryRepositoryImpl';
import {SettingsRepositoryImpl} from '@data/repositories/SettingsRepositoryImpl';

import {LocalTtsService} from '@data/services/LocalTtsService';
import {BackupService} from '@data/services/BackupService';

/**
 * Đăng ký toàn bộ phụ thuộc dạng singleton (lazy).
 * Gọi MỘT LẦN khi khởi động app (trước khi init database).
 */
export const registerDependencies = (
  container: Container = Container.instance,
): Container => {
  container.registerSingleton(TOKENS.DatabaseService, () => new DatabaseService());
  container.registerSingleton(
    TOKENS.AsyncStorageDataSource,
    () => new AsyncStorageDataSource(),
  );

  const db = (c: Container): IDatabaseService =>
    c.resolve<IDatabaseService>(TOKENS.DatabaseService);

  container.registerSingleton(
    TOKENS.CategoryRepository,
    c => new CategoryRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.VocabularyRepository,
    c => new VocabularyRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.ActivityCategoryRepository,
    c => new ActivityCategoryRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.ActivityRepository,
    c => new ActivityRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.ChildRepository,
    c => new ChildRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.FavoriteRepository,
    c => new FavoriteRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.UsageHistoryRepository,
    c => new UsageHistoryRepositoryImpl(db(c)),
  );
  container.registerSingleton(
    TOKENS.SettingsRepository,
    c => new SettingsRepositoryImpl(db(c)),
  );

  // TTS: dùng LocalTtsService (react-native-tts). Để thay bằng MockTtsService
  // khi gặp sự cố R2, chỉ cần đổi dòng dưới thành: () => new MockTtsService().
  container.registerSingleton(TOKENS.TtsService, () => new LocalTtsService());

  container.registerSingleton(
    TOKENS.BackupService,
    c => new BackupService(db(c)),
  );

  return container;
};
