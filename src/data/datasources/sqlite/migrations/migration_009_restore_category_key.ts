/**
 * src/data/datasources/sqlite/migrations/migration_009_restore_category_key.ts
 * Mục đích: Thêm cột category_key vào bảng vocabulary và activities để phân loại
 *           các thẻ theo nhóm Ăn uống (food), Sinh hoạt (personal), Đồ vật (objects).
 *           Mặc định gán category_key tương ứng cho các dữ liệu có sẵn.
 */
import {Migration} from './Migration';

export const migration009RestoreCategoryKey: Migration = {
  version: 9,
  statements: [
    `ALTER TABLE vocabulary ADD COLUMN category_key TEXT;`,
    `ALTER TABLE activities ADD COLUMN category_key TEXT;`,

    // Cập nhật dữ liệu mặc định cho activities
    `UPDATE activities SET category_key = 'food' WHERE name_vi IN ('Cơm', 'Thịt gà', 'Trứng chiên', 'Canh', 'Nước lọc', 'Sữa', 'Nước cam', 'Sữa chua', 'Táo', 'Chuối', 'Cam', 'Dưa hấu');`,
    `UPDATE activities SET category_key = 'personal' WHERE name_vi IN ('Ăn', 'Uống', 'Ngủ', 'Đi vệ sinh', 'Rửa tay', 'Đánh răng', 'Tắm', 'Áo thun', 'Quần dài');`,
    `UPDATE activities SET category_key = 'objects' WHERE name_vi IN ('Xe đồ chơi', 'Quả bóng', 'Gấu bông', 'Búp bê', 'Khối gỗ', 'Sách', 'Bút chì', 'Vở', 'Cục tẩy');`,
    
    // Cập nhật dữ liệu mặc định cho vocabulary (nếu có, dùng chung logic)
    `UPDATE vocabulary SET category_key = 'food' WHERE name_vi IN ('Cơm', 'Thịt gà', 'Trứng chiên', 'Canh', 'Nước lọc', 'Sữa', 'Nước cam', 'Sữa chua', 'Táo', 'Chuối', 'Cam', 'Dưa hấu');`,
    `UPDATE vocabulary SET category_key = 'personal' WHERE name_vi IN ('Ăn', 'Uống', 'Ngủ', 'Đi vệ sinh', 'Rửa tay', 'Đánh răng', 'Tắm', 'Áo thun', 'Quần dài');`,
    `UPDATE vocabulary SET category_key = 'objects' WHERE name_vi IN ('Xe đồ chơi', 'Quả bóng', 'Gấu bông', 'Búp bê', 'Khối gỗ', 'Sách', 'Bút chì', 'Vở', 'Cục tẩy');`,
  ],
};
