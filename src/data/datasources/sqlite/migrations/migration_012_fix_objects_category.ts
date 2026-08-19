/**
 * src/data/datasources/sqlite/migrations/migration_012_fix_objects_category.ts
 * Mục đích: Fix lỗi dữ liệu bị gán category_key = 'activity' thay vì 'objects' 
 *           cho các từ Khối gỗ, Sách, Búp bê (do seedData cũ bị sai).
 */
import {Migration} from './Migration';

export const migration012FixObjectsCategory: Migration = {
  version: 12,
  statements: [
    `UPDATE activities SET category_key = 'objects' WHERE name_vi IN ('Búp bê', 'Khối gỗ', 'Sách');`,
    `UPDATE vocabulary SET category_key = 'objects' WHERE name_vi IN ('Búp bê', 'Khối gỗ', 'Sách');`,
  ],
};
