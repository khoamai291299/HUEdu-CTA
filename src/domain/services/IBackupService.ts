/**
 * src/domain/services/IBackupService.ts
 * Mục đích: Hợp đồng sao lưu/khôi phục dữ liệu ra/ từ JSON (FR-15).
 * Dependency: không.
 */
export interface BackupPayload {
  app: string;
  version: number;
  exportedAt: number;
  data: {
    children: unknown[];
    categories: unknown[];
    vocabulary: unknown[];
    favorites: unknown[];
    usageHistory: unknown[];
    settings: Record<string, string>;
  };
}

export interface IBackupService {
  /** Tạo chuỗi JSON từ toàn bộ dữ liệu. */
  exportToJson(): Promise<string>;
  /** Ghi JSON ra file, trả về đường dẫn file. */
  exportToFile(): Promise<string>;
  /** Khôi phục dữ liệu từ chuỗi JSON (ghi đè trong giao dịch). */
  importFromJson(json: string): Promise<void>;
}
