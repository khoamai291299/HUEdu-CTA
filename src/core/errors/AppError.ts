/**
 * src/core/errors/AppError.ts
 * Mục đích: Lớp lỗi nền tảng cho toàn ứng dụng. Mọi lỗi nghiệp vụ kế thừa lớp này.
 *           Mang theo mã lỗi (code) để UI ánh xạ thông điệp i18n, và lỗi gốc (cause).
 * OOP: Abstract base + inheritance + encapsulation (readonly fields).
 * Dependency: không.
 */
export type ErrorCode =
  | 'UNKNOWN'
  | 'DATABASE'
  | 'TTS'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'PIN_INVALID'
  | 'BACKUP';

export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly cause?: unknown;

  protected constructor(code: ErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.cause = cause;
    // Giữ prototype chain đúng khi transpile sang ES5/ES6.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Lỗi nghiệp vụ chung (validation, not found...). */
export class DomainError extends AppError {
  constructor(code: ErrorCode, message: string, cause?: unknown) {
    super(code, message, cause);
  }
}
