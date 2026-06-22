/**
 * src/data/datasources/sqlite/migrations/Migration.ts
 * Mục đích: Hợp đồng cho một bước migration (version + danh sách câu lệnh SQL).
 * Dependency: không.
 */
export interface Migration {
  /** Phiên bản đích sau khi migration này chạy xong. */
  version: number;
  /** Các câu lệnh DDL/DML chạy tuần tự trong cùng một giao dịch. */
  statements: string[];
}
