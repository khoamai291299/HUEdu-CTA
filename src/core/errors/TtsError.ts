/**
 * src/core/errors/TtsError.ts
 * Mục đích: Lỗi liên quan tới Text-To-Speech (khởi tạo, phát âm, thiếu giọng).
 * Dependency: AppError.
 */
import {AppError} from './AppError';

export class TtsError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('TTS', message, cause);
  }
}
