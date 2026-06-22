/**
 * src/data/datasources/sqlite/migrations/migration_003_fix_usage_history.ts
 * Mục đích: Gỡ bỏ khóa ngoại (Foreign Key) `vocabulary_id` trong `usage_history`
 *           để cho phép chèn ID của bảng `activities`.
 */
import {Migration} from './Migration';

export const migration003FixUsageHistory: Migration = {
  version: 3,
  statements: [
    `CREATE TABLE IF NOT EXISTS usage_history_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      vocabulary_id INTEGER NOT NULL,
      used_at INTEGER NOT NULL,
      context TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
    );`,
    `INSERT INTO usage_history_new (id, child_id, vocabulary_id, used_at, context)
     SELECT id, child_id, vocabulary_id, used_at, context FROM usage_history;`,
    `DROP TABLE usage_history;`,
    `ALTER TABLE usage_history_new RENAME TO usage_history;`,
    `CREATE INDEX IF NOT EXISTS idx_usage_child_date ON usage_history(child_id, used_at);`,
  ],
};
