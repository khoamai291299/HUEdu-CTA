/**
 * src/data/datasources/sqlite/migrations/migration_006_drop_category_columns.ts
 * Mục đích: Loại bỏ cột category_id và FK constraint khỏi vocabulary và activities.
 *           SQLite không hỗ trợ DROP COLUMN trên các phiên bản cũ, nên ta phải
 *           tạo bảng mới, copy dữ liệu, xóa bảng cũ, đổi tên bảng mới.
 */
import {Migration} from './Migration';

export const migration006DropCategoryColumns: Migration = {
  version: 6,
  statements: [
    // --- vocabulary ---
    `CREATE TABLE IF NOT EXISTS vocabulary_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT,
      image_path TEXT,
      speech_text_vi TEXT,
      speech_text_en TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,
    `INSERT INTO vocabulary_new (id, name_vi, name_en, image_path, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at)
     SELECT id, name_vi, name_en, image_path, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at
     FROM vocabulary;`,
    `DROP TABLE vocabulary;`,
    `ALTER TABLE vocabulary_new RENAME TO vocabulary;`,
    `CREATE INDEX IF NOT EXISTS idx_vocab_sort ON vocabulary(sort_order);`,

    // --- activities ---
    `CREATE TABLE IF NOT EXISTS activities_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT,
      image_path TEXT,
      speech_text_vi TEXT,
      speech_text_en TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,
    `INSERT INTO activities_new (id, name_vi, name_en, image_path, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at)
     SELECT id, name_vi, name_en, image_path, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at
     FROM activities;`,
    `DROP TABLE activities;`,
    `ALTER TABLE activities_new RENAME TO activities;`,
    `CREATE INDEX IF NOT EXISTS idx_activity_sort ON activities(sort_order);`,

    // Rebuild favorites FK to point to new vocabulary table
    `CREATE TABLE IF NOT EXISTS favorites_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      vocabulary_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE (child_id, vocabulary_id),
      FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
      FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
    );`,
    `INSERT INTO favorites_new (id, child_id, vocabulary_id, created_at)
     SELECT id, child_id, vocabulary_id, created_at FROM favorites;`,
    `DROP TABLE favorites;`,
    `ALTER TABLE favorites_new RENAME TO favorites;`,
  ],
};
