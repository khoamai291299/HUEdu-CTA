/**
 * src/data/datasources/sqlite/migrations/migration_001_init.ts
 * Mục đích: Migration khởi tạo schema v1 (children, categories, vocabulary,
 *           favorites, usage_history, settings) + index.
 * Dependency: Migration.
 */
import {Migration} from './Migration';

export const migration001Init: Migration = {
  version: 1,
  statements: [
    `CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar_path TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'vocabulary',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT,
      image_path TEXT,
      category_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'vocabulary',
      speech_text_vi TEXT,
      speech_text_en TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );`,
    `CREATE INDEX IF NOT EXISTS idx_vocab_category ON vocabulary(category_id);`,

    `CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      vocabulary_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE (child_id, vocabulary_id),
      FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
      FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS usage_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      vocabulary_id INTEGER NOT NULL,
      used_at INTEGER NOT NULL,
      context TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
      FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
    );`,
    `CREATE INDEX IF NOT EXISTS idx_usage_child_date ON usage_history(child_id, used_at);`,

    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );`,
  ],
};
