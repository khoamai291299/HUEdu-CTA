/**
 * src/data/datasources/sqlite/migrations/migration_004_add_child_fields.ts
 * Mục đích: Thêm các cột cho tính năng Onboarding (màu da, khu vực, bệnh, năm sinh).
 * Dependency: Migration.
 */
import {Migration} from './Migration';

export const migration004AddChildFields: Migration = {
  version: 4,
  statements: [
    `ALTER TABLE children ADD COLUMN skin_tone TEXT DEFAULT 'pale';`,
    `ALTER TABLE children ADD COLUMN region TEXT DEFAULT 'North';`,
    `ALTER TABLE children ADD COLUMN diagnosis TEXT DEFAULT 'Unknown';`,
    `ALTER TABLE children ADD COLUMN birth_year INTEGER DEFAULT 2020;`,
  ],
};
