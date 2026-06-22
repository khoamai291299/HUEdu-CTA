/**
 * src/data/datasources/sqlite/migrations/MigrationRunner.ts
 * Mục đích: Chạy tuần tự các migration còn thiếu dựa trên PRAGMA user_version,
 *           trong giao dịch, có thể mở rộng (Open/Closed) bằng cách thêm migration mới.
 * Dependency: IDatabaseService, danh sách migration, logger.
 */
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {logger} from '@core/utils/logger';
import {Migration} from './Migration';
import {migration001Init} from './migration_001_init';
import {migration002SplitActivities} from './migration_002_split_activities';
import {migration003FixUsageHistory} from './migration_003_fix_usage_history';
import {migration004AddChildFields} from './migration_004_add_child_fields';
import {migration005RemoveCategories} from './migration_005_remove_categories';
import {migration006DropCategoryColumns} from './migration_006_drop_category_columns';

const ALL_MIGRATIONS: Migration[] = [
  migration001Init,
  migration002SplitActivities,
  migration003FixUsageHistory,
  migration004AddChildFields,
  migration005RemoveCategories,
  migration006DropCategoryColumns,
].sort(
  (a, b) => a.version - b.version,
);

export class MigrationRunner {
  constructor(private readonly db: IDatabaseService) {}

  async run(): Promise<void> {
    const currentVersion = await this.db.getUserVersion();
    const pending = ALL_MIGRATIONS.filter(m => m.version > currentVersion);
    if (pending.length === 0) {
      logger.debug('[MigrationRunner] schema up-to-date', currentVersion);
      return;
    }
    for (const migration of pending) {
      await this.db.transaction(async exec => {
        for (const stmt of migration.statements) {
          await exec(stmt);
        }
      });
      await this.db.setUserVersion(migration.version);
      logger.info('[MigrationRunner] applied version', migration.version);
    }
  }
}
