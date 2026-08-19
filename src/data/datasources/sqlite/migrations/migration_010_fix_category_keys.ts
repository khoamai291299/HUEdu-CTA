/**
 * src/data/datasources/sqlite/migrations/migration_010_fix_category_keys.ts
 * Mục đích: Fix lỗi dữ liệu bị mất category_key trong trường hợp người dùng
 *           cài mới (Seeder chạy sau Migration 009 nên không gán category_key).
 */
import {Migration} from './Migration';

export const migration010FixCategoryKeys: Migration = {
  version: 10,
  statements: [
    `UPDATE activities SET category_key = 'food' WHERE name_vi IN ('Cơm', 'Thịt gà', 'Trứng chiên', 'Canh', 'Nước lọc', 'Sữa', 'Nước cam', 'Sữa chua', 'Táo', 'Chuối', 'Cam', 'Dưa hấu');`,
    `UPDATE activities SET category_key = 'personal' WHERE name_vi IN ('Ăn', 'Uống', 'Ngủ', 'Đi vệ sinh', 'Rửa tay', 'Đánh răng', 'Tắm', 'Áo thun', 'Quần dài');`,
    `UPDATE activities SET category_key = 'objects' WHERE name_vi IN ('Xe đồ chơi', 'Quả bóng', 'Gấu bông', 'Búp bê', 'Khối gỗ', 'Sách', 'Bút chì', 'Vở', 'Cục tẩy');`,

    `UPDATE vocabulary SET category_key = 'food' WHERE name_vi IN ('Cơm', 'Thịt gà', 'Trứng chiên', 'Canh', 'Nước lọc', 'Sữa', 'Nước cam', 'Sữa chua', 'Táo', 'Chuối', 'Cam', 'Dưa hấu');`,
    `UPDATE vocabulary SET category_key = 'personal' WHERE name_vi IN ('Ăn', 'Uống', 'Ngủ', 'Đi vệ sinh', 'Rửa tay', 'Đánh răng', 'Tắm', 'Áo thun', 'Quần dài');`,
    `UPDATE vocabulary SET category_key = 'objects' WHERE name_vi IN ('Xe đồ chơi', 'Quả bóng', 'Gấu bông', 'Búp bê', 'Khối gỗ', 'Sách', 'Bút chì', 'Vở', 'Cục tẩy');`,
  ],
};
