/**
 * src/data/models/rows.ts
 * Mục đích: Khai báo hình dạng "row" trả về từ SQLite (snake_case) cho từng bảng.
 *           Tách rõ tầng dữ liệu thô với entity domain (camelCase).
 * Dependency: không.
 */
export interface ChildRow {
  id: number;
  name: string;
  avatar_path: string | null;
  created_at: number;
  updated_at: number;
}

export interface CategoryRow {
  id: number;
  name_vi: string;
  name_en: string;
  icon: string;
  color: string;
  sort_order: number;
  is_default: number;
  created_at: number;
  updated_at: number;
}

export interface ActivityCategoryRow {
  id: number;
  name_vi: string;
  name_en: string;
  icon: string;
  color: string;
  sort_order: number;
  is_default: number;
  created_at: number;
  updated_at: number;
}

export interface VocabularyRow {
  id: number;
  name_vi: string;
  name_en: string | null;
  image_path: string | null;
  category_id: number;
  speech_text_vi: string | null;
  speech_text_en: string | null;
  is_default: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface ActivityRow {
  id: number;
  name_vi: string;
  name_en: string | null;
  image_path: string | null;
  category_id: number;
  speech_text_vi: string | null;
  speech_text_en: string | null;
  is_default: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface UsageRow {
  id: number;
  child_id: number;
  vocabulary_id: number;
  used_at: number;
  context: string;
}
