/**
 * src/domain/services/IDatabaseService.ts
 * Mục đích: Hợp đồng dịch vụ cơ sở dữ liệu - trừu tượng hoá SQLite khỏi tầng trên.
 *           Cho phép thay driver (react-native-sqlite-storage -> op-sqlite) không ảnh hưởng repository.
 * Dependency: không.
 */
export interface SqlResult {
  rows: Array<Record<string, unknown>>;
  insertId?: number;
  rowsAffected: number;
}

/** Hàm thực thi SQL trong phạm vi một giao dịch. */
export type TxExecutor = (
  sql: string,
  params?: unknown[],
) => Promise<SqlResult>;

export interface IDatabaseService {
  /** Mở DB, bật foreign_keys, chạy migration & seed. */
  init(): Promise<void>;
  /** Thực thi một câu lệnh SQL (autocommit). */
  executeSql(sql: string, params?: unknown[]): Promise<SqlResult>;
  /** Thực thi nhiều câu lệnh trong một giao dịch (rollback nếu lỗi). */
  transaction(work: (exec: TxExecutor) => Promise<void>): Promise<void>;
  /** Lấy/đặt PRAGMA user_version. */
  getUserVersion(): Promise<number>;
  setUserVersion(version: number): Promise<void>;
  close(): Promise<void>;
}
