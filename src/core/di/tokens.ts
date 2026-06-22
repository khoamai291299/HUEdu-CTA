/**
 * src/core/di/tokens.ts
 * Mục đích: Khai báo các "token" định danh dịch vụ trong DI container (type-safe).
 *           Token là Symbol để tránh trùng lặp chuỗi.
 * Dependency: không.
 */
export const TOKENS = {
  DatabaseService: Symbol('DatabaseService'),
  AsyncStorageDataSource: Symbol('AsyncStorageDataSource'),

  ChildRepository: Symbol('ChildRepository'),
  CategoryRepository: Symbol('CategoryRepository'),
  VocabularyRepository: Symbol('VocabularyRepository'),
  ActivityRepository: Symbol('ActivityRepository'),
  ActivityCategoryRepository: Symbol('ActivityCategoryRepository'),
  FavoriteRepository: Symbol('FavoriteRepository'),
  UsageHistoryRepository: Symbol('UsageHistoryRepository'),
  SettingsRepository: Symbol('SettingsRepository'),

  TtsService: Symbol('TtsService'),
  BackupService: Symbol('BackupService'),
} as const;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
