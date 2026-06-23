/**
 * __tests__/SentenceBuilder.test.ts
 * Mục đích: Kiểm thử logic ghép câu THUẦN (SentenceBuilder) - cốt lõi tính năng FR-02.
 */
import {SentenceBuilder} from '@domain/usecases/sentence/SentenceBuilder';
import {Vocabulary} from '@domain/entities/Vocabulary';

const makeWord = (id: number, nameVi: string): Vocabulary =>
  new Vocabulary({
    id,
    nameVi,
    isDefault: true,
    sortOrder: id,
    createdAt: 0,
    updatedAt: 0,
  });

describe('SentenceBuilder', () => {
  const con = makeWord(1, 'Con');
  const muon = makeWord(2, 'muốn');
  const nuoc = makeWord(3, 'nước');

  it('addWord trả về mảng mới, không sửa mảng cũ (bất biến)', () => {
    const start: Vocabulary[] = [];
    const next = SentenceBuilder.addWord(start, con);
    expect(next).toHaveLength(1);
    expect(start).toHaveLength(0);
  });

  it('buildText ghép văn bản tiếng Việt đúng thứ tự', () => {
    const words = [con, muon, nuoc];
    expect(SentenceBuilder.buildText(words)).toBe('Con muốn nước');
  });

  it('removeAt và removeLast hoạt động đúng', () => {
    const words = [con, muon, nuoc];
    expect(SentenceBuilder.removeAt(words, 1)).toEqual([con, nuoc]);
    expect(SentenceBuilder.removeLast(words)).toEqual([con, muon]);
    expect(SentenceBuilder.removeAt(words, 99)).toEqual(words);
  });

  it('clear trả về mảng rỗng & buildLabel viết hoa đầu câu', () => {
    expect(SentenceBuilder.clear()).toEqual([]);
    expect(SentenceBuilder.buildLabel([con, muon, nuoc])).toBe(
      'Con muốn nước',
    );
    expect(SentenceBuilder.buildLabel([])).toBe('');
  });
});
