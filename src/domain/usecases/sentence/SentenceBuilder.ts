/**
 * src/domain/usecases/sentence/SentenceBuilder.ts
 * Mục đích: Logic ghép câu THUẦN (không phụ thuộc UI/DB) - dễ unit test (FR-02).
 *           Thao tác bất biến: trả về mảng mới, không sửa mảng cũ.
 * OOP: class + encapsulation.
 * Dependency: Vocabulary.
 */
import {Vocabulary} from '@domain/entities/Vocabulary';

export class SentenceBuilder {
  /** Thêm một từ vào cuối câu. */
  static addWord(words: Vocabulary[], word: Vocabulary): Vocabulary[] {
    return [...words, word];
  }

  /** Xoá từ tại vị trí index. */
  static removeAt(words: Vocabulary[], index: number): Vocabulary[] {
    if (index < 0 || index >= words.length) {
      return words;
    }
    return words.filter((_, i) => i !== index);
  }

  /** Xoá từ cuối cùng. */
  static removeLast(words: Vocabulary[]): Vocabulary[] {
    return words.slice(0, -1);
  }

  /** Xoá toàn bộ câu. */
  static clear(): Vocabulary[] {
    return [];
  }

  /** Ghép thành chuỗi văn bản đọc. */
  static buildText(words: Vocabulary[]): string {
    return words
      .map(w => w.speechText())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Ghép thành chuỗi hiển thị (có hoa đầu câu cho dễ đọc). */
  static buildLabel(words: Vocabulary[]): string {
    const text = words.map(w => w.label()).join(' ').trim();
    if (text.length === 0) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
