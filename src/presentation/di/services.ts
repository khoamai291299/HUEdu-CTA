/**
 * src/presentation/di/services.ts
 * Mục đích: Hàm tiện ích lấy service/repository từ DI Container theo token (type-safe),
 *           giúp store/hook không lặp lại Container.instance.resolve(...).
 * Dependency: Container, TOKENS, các interface domain.
 */
import {Container} from '@core/di/Container';
import {TOKENS} from '@core/di/tokens';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {ITtsService} from '@domain/services/ITtsService';
import {IBackupService} from '@domain/services/IBackupService';
import {ICategoryRepository} from '@domain/repositories/ICategoryRepository';
import {IVocabularyRepository} from '@domain/repositories/IVocabularyRepository';
import {IActivityCategoryRepository} from '@domain/repositories/IActivityCategoryRepository';
import {IActivityRepository} from '@domain/repositories/IActivityRepository';
import {IChildRepository} from '@domain/repositories/IChildRepository';
import {IFavoriteRepository} from '@domain/repositories/IFavoriteRepository';
import {IUsageHistoryRepository} from '@domain/repositories/IUsageHistoryRepository';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';

const c = () => Container.instance;

export const getDb = (): IDatabaseService =>
  c().resolve(TOKENS.DatabaseService);
export const getTts = (): ITtsService => c().resolve(TOKENS.TtsService);
export const getBackup = (): IBackupService =>
  c().resolve(TOKENS.BackupService);
export const getCategoryRepo = (): ICategoryRepository =>
  c().resolve(TOKENS.CategoryRepository);
export const getVocabularyRepo = (): IVocabularyRepository =>
  c().resolve(TOKENS.VocabularyRepository);
export const getActivityCategoryRepo = (): IActivityCategoryRepository =>
  c().resolve(TOKENS.ActivityCategoryRepository);
export const getActivityRepo = (): IActivityRepository =>
  c().resolve(TOKENS.ActivityRepository);
export const getChildRepo = (): IChildRepository =>
  c().resolve(TOKENS.ChildRepository);
export const getFavoriteRepo = (): IFavoriteRepository =>
  c().resolve(TOKENS.FavoriteRepository);
export const getUsageRepo = (): IUsageHistoryRepository =>
  c().resolve(TOKENS.UsageHistoryRepository);
export const getSettingsRepo = (): ISettingsRepository =>
  c().resolve(TOKENS.SettingsRepository);
