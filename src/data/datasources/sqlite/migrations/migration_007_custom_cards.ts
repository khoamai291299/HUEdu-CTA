/**
 * src/data/datasources/sqlite/migrations/migration_007_custom_cards.ts
 * Mục đích: Thêm cột audio_path vào bảng vocabulary để hỗ trợ Custom Cards (ghi âm giọng nói riêng).
 * Cột is_custom để phân biệt thẻ mặc định và thẻ tự tạo.
 */
import {Migration} from './Migration';

export const migration007CustomCards: Migration = {
  version: 7,
  statements: [
    `ALTER TABLE vocabulary ADD COLUMN is_custom INTEGER NOT NULL DEFAULT 0;`,
    `ALTER TABLE vocabulary ADD COLUMN audio_path TEXT;`,
    `ALTER TABLE activities ADD COLUMN is_custom INTEGER NOT NULL DEFAULT 0;`,
    `ALTER TABLE activities ADD COLUMN audio_path TEXT;`,
  ],
};
