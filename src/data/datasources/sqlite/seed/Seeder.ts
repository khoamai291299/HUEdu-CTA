/**
 * src/data/datasources/sqlite/seed/Seeder.ts
 * Mục đích: Nạp dữ liệu mẫu lần đầu (idempotent qua cờ settings SCHEMA_SEEDED),
 *           toàn bộ trong một giao dịch.
 * Dependency: IDatabaseService, seedData, constants, logger.
 */
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {SettingKey} from '@core/constants';
import {logger} from '@core/utils/logger';
import {
  SEED_CATEGORIES,
  SEED_DEFAULT_CHILD,
  SEED_VOCABULARY,
} from './seedData';

export class Seeder {
  constructor(private readonly db: IDatabaseService) {}

  async runIfNeeded(): Promise<void> {
    const seeded = await this.db.executeSql(
      'SELECT value FROM settings WHERE key = ?;',
      [SettingKey.SCHEMA_SEEDED],
    );
    if (seeded.rows.length > 0) {
      logger.debug('[Seeder] already seeded');
      return;
    }

    const ts = Date.now();
    await this.db.transaction(async exec => {
      // 1) Categories -> map key -> id
      const categoryIdByKey: Record<string, number> = {};
      for (const c of SEED_CATEGORIES) {
        const table = c.type === 'activity' ? 'activity_categories' : 'categories';
        const res = await exec(
          `INSERT INTO ${table}
            (name_vi, name_en, icon, color, sort_order, is_default, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 1, ?, ?);`,
          [c.nameVi, c.nameEn, c.icon, c.color, c.sortOrder, ts, ts],
        );
        categoryIdByKey[c.key] = res.insertId as number;
      }

      // 2) Vocabulary/Activities
      for (const v of SEED_VOCABULARY) {
        const categoryId = categoryIdByKey[v.categoryKey];
        const table = v.type === 'activity' ? 'activities' : 'vocabulary';
        await exec(
          `INSERT INTO ${table}
            (name_vi, name_en, image_path, category_id, speech_text_vi, speech_text_en,
             is_default, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?);`,
          [v.nameVi, v.nameEn, v.imagePath || null, categoryId, v.speechTextVi || null, v.speechTextEn || null, v.sortOrder, ts, ts],
        );
      }

      // 3) Default child profile
      await exec(
        `INSERT INTO children (name, avatar_path, created_at, updated_at)
         VALUES (?, NULL, ?, ?);`,
        [SEED_DEFAULT_CHILD.name, ts, ts],
      );

      // 4) Mark seeded
      await exec(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?);`,
        [SettingKey.SCHEMA_SEEDED, '1', ts],
      );
    });

    logger.info('[Seeder] seed completed');
  }
}
