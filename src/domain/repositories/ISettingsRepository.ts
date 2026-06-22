/**
 * src/domain/repositories/ISettingsRepository.ts
 * Mục đích: Hợp đồng đọc/ghi cấu hình dạng key-value (bảng settings).
 * Dependency: không.
 */
export interface ISettingsRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  getAll(): Promise<Record<string, string>>;
  remove(key: string): Promise<void>;
}
