/**
 * src/data/datasources/sqlite/migrations/migration_013_pecs.ts
 * Mục đích: Tạo bảng pecs_interactions lưu từng lượt tương tác của trẻ ở Bước 1 PECS
 *           (thành công / độc lập / thời gian phản hồi / số lần hủy kéo).
 *           Dùng để tính cờ isReadyForNextStage (20 lượt gần nhất, >= 80%).
 * Lưu ý: KHÔNG đặt khóa ngoại tới activities (thẻ có thể bị xoá) — theo tiền lệ migration 003.
 */
import {Migration} from './Migration';

export const migration013Pecs: Migration = {
  version: 13,
  statements: [
    `CREATE TABLE IF NOT EXISTS pecs_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      card_id INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      response_ms INTEGER NOT NULL,
      is_success INTEGER NOT NULL DEFAULT 0,
      is_independent INTEGER NOT NULL DEFAULT 0,
      cancel_count INTEGER NOT NULL DEFAULT 0,
      input_kind TEXT NOT NULL DEFAULT 'drag'
    );`,
    `CREATE INDEX IF NOT EXISTS idx_pecs_child_time
       ON pecs_interactions(child_id, occurred_at);`,
  ],
};
