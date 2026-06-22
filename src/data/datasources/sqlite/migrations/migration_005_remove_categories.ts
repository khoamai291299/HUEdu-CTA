/**
 * src/data/datasources/sqlite/migrations/migration_005_remove_categories.ts
 * Mục đích: Xóa bỏ hoàn toàn Category khỏi CSDL để tối giản app.
 * Thực thi: Drop bảng categories, activity_categories.
 * (SQLite không hỗ trợ DROP COLUMN đơn giản trong các bản cũ, nhưng do app đang dev 
 * ta có thể bỏ qua cột category_id trong Entity, hoặc tạo bảng mới và copy data nếu cần.
 * Ở đây ta chỉ drop bảng categories để không bị ràng buộc ngoại).
 */
import {Migration} from './Migration';


export const migration005RemoveCategories: Migration = {
  version: 5,
  statements: [
    'DROP TABLE IF EXISTS categories;',
    'DROP TABLE IF EXISTS activity_categories;',
  ],
};
