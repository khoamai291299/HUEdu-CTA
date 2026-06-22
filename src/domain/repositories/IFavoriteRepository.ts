/**
 * src/domain/repositories/IFavoriteRepository.ts
 * Mục đích: Hợp đồng truy cập từ yêu thích theo hồ sơ trẻ.
 * Dependency: Vocabulary.
 */
import {Vocabulary} from '@domain/entities/Vocabulary';

export interface IFavoriteRepository {
  isFavorite(childId: number, vocabularyId: number): Promise<boolean>;
  add(childId: number, vocabularyId: number): Promise<void>;
  remove(childId: number, vocabularyId: number): Promise<void>;
  getFavoriteVocabulary(childId: number): Promise<Vocabulary[]>;
}
