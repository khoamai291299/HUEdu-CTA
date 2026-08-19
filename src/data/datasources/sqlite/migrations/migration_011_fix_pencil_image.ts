/**
 * src/data/datasources/sqlite/migrations/migration_011_fix_pencil_image.ts
 * Mục đích: Đổi ảnh Bút chì từ arasaac_pencil_eraser sang arasaac_pencil
 */
import {Migration} from './Migration';

export const migration011FixPencilImage: Migration = {
  version: 11,
  statements: [
    `UPDATE activities SET image_path = 'arasaac_pencil' WHERE name_vi = 'Bút chì';`,
    `UPDATE vocabulary SET image_path = 'arasaac_pencil' WHERE name_vi = 'Bút chì';`,
  ],
};
