/**
 * src/domain/repositories/IVocabularyRepository.ts
 * Mục đích: Hợp đồng truy cập từ vựng (CRUD + tìm kiếm + theo danh mục).
 * Dependency: Vocabulary, IBaseRepository.
 */
import {Vocabulary} from '@domain/entities/Vocabulary';
import {IBaseRepository} from './IBaseRepository';

export interface VocabularyInput {
  nameVi: string;
  nameEn?: string | null;
  imagePath?: string | null;
  categoryId: number;
  speechTextVi?: string | null;
  speechTextEn?: string | null;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface IVocabularyRepository extends IBaseRepository<Vocabulary> {
  create(input: VocabularyInput): Promise<Vocabulary>;
  update(id: number, input: Partial<VocabularyInput>): Promise<Vocabulary>;
  getByCategory(categoryId: number): Promise<Vocabulary[]>;
  search(query: string): Promise<Vocabulary[]>;
}
