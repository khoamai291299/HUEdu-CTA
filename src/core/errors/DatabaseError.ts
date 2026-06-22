/**
 * src/core/errors/DatabaseError.ts
 * Mục đích: Lỗi liên quan tới SQLite (mở DB, migration, truy vấn).
 * Dependency: AppError.
 */
import {AppError} from './AppError';

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('DATABASE', message, cause);
  }
}
