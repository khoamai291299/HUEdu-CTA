/**
 * src/data/datasources/sqlite/migrations/migration_002_split_activities.ts
 * Mục đích: Tạo bảng activities và activity_categories riêng biệt, 
 *           chuyển dữ liệu cũ từ categories/vocabulary sang bảng mới dựa trên type.
 *           Xóa cột type khỏi categories và vocabulary.
 */
import {Migration} from './Migration';

export const migration002SplitActivities: Migration = {
  version: 2,
  statements: [
    // 1. Tạo bảng mới
    `CREATE TABLE IF NOT EXISTS activity_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_vi TEXT NOT NULL,
      name_en TEXT,
      image_path TEXT,
      category_id INTEGER NOT NULL,
      speech_text_vi TEXT,
      speech_text_en TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES activity_categories(id) ON DELETE RESTRICT
    );`,
    `CREATE INDEX IF NOT EXISTS idx_activity_category ON activities(category_id);`,

    // 2. Chuyển dữ liệu từ categories (type='activity') sang activity_categories
    `INSERT INTO activity_categories (id, name_vi, name_en, icon, color, sort_order, is_default, created_at, updated_at)
     SELECT id, name_vi, name_en, icon, color, sort_order, is_default, created_at, updated_at
     FROM categories WHERE type = 'activity';`,

    // 3. Chuyển dữ liệu từ vocabulary (type='activity') sang activities
    `INSERT INTO activities (id, name_vi, name_en, image_path, category_id, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at)
     SELECT id, name_vi, name_en, image_path, category_id, speech_text_vi, speech_text_en, is_default, sort_order, created_at, updated_at
     FROM vocabulary WHERE type = 'activity';`,

    // 4. Xóa các record type='activity' khỏi bảng cũ
    `DELETE FROM vocabulary WHERE type = 'activity';`,
    `DELETE FROM categories WHERE type = 'activity';`,

    // SQLite không hỗ trợ DROP COLUMN đơn giản trong bản cũ hoặc có thể gây lỗi, 
    // nhưng ta có thể bỏ qua nó (dữ liệu rác) hoặc tạo bảng mới và copy lại. 
    // Để an toàn, ở đây ta chỉ xóa dữ liệu, cột `type` sẽ không còn được insert/select từ Dao.
  ],
};
