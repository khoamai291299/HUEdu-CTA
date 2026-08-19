/**
 * src/data/datasources/sqlite/migrations/migration_008_update_seed_data.ts
 * Mục đích: Cập nhật lại các trường image_path và speech_text_vi cho các từ vựng mặc định
 *           để đồng bộ với thay đổi mới nhất (đã xóa các từ thừa, đổi ảnh Arasaac).
 *           Điều này giúp người dùng update app không bị lỗi đọc giọng Google TTS
 *           do thiếu speech_text_vi hoặc hiển thị ảnh cũ (lucide).
 */
import {Migration} from './Migration';
import {SEED_VOCABULARY} from '../seed/seedData';

// Tạo danh sách câu lệnh UPDATE cho các từ vựng mặc định
const statements = SEED_VOCABULARY.map(v => {
  // Thay thế nháy đơn bằng nháy đơn kép để tránh lỗi SQL
  const speechText = v.speechTextVi ? `'${v.speechTextVi.replace(/'/g, "''")}'` : 'NULL';
  const imagePath = v.imagePath ? `'${v.imagePath.replace(/'/g, "''")}'` : 'NULL';
  const name = v.nameVi.replace(/'/g, "''");
  
  return `UPDATE activities 
          SET speech_text_vi = ${speechText}, image_path = ${imagePath}
          WHERE name_vi = '${name}' AND is_default = 1;`;
});

export const migration008UpdateSeedData: Migration = {
  version: 8,
  statements,
};
