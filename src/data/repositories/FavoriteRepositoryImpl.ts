/**
 * src/data/repositories/FavoriteRepositoryImpl.ts
 * Mục đích: Hiện thực IFavoriteRepository (đánh dấu yêu thích theo hồ sơ trẻ) trên SQLite.
 * Dependency: IFavoriteRepository, IDatabaseService, mappers, Vocabulary.
 */
import {IFavoriteRepository} from '@domain/repositories/IFavoriteRepository';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {toVocabulary} from '@data/mappers/mappers';
import {VocabularyRow} from '@data/models/rows';

export class FavoriteRepositoryImpl implements IFavoriteRepository {
  constructor(private readonly db: IDatabaseService) {}

  async isFavorite(childId: number, vocabularyId: number): Promise<boolean> {
    const res = await this.db.executeSql(
      'SELECT 1 FROM favorites WHERE child_id = ? AND vocabulary_id = ? LIMIT 1;',
      [childId, vocabularyId],
    );
    return res.rows.length > 0;
  }

  async add(childId: number, vocabularyId: number): Promise<void> {
    await this.db.executeSql(
      `INSERT OR IGNORE INTO favorites (child_id, vocabulary_id, created_at)
       VALUES (?, ?, ?);`,
      [childId, vocabularyId, Date.now()],
    );
  }

  async remove(childId: number, vocabularyId: number): Promise<void> {
    await this.db.executeSql(
      'DELETE FROM favorites WHERE child_id = ? AND vocabulary_id = ?;',
      [childId, vocabularyId],
    );
  }

  async getFavoriteVocabulary(childId: number): Promise<Vocabulary[]> {
    const res = await this.db.executeSql(
      `SELECT v.* FROM vocabulary v
       INNER JOIN favorites f ON f.vocabulary_id = v.id
       WHERE f.child_id = ?
       ORDER BY f.created_at DESC;`,
      [childId],
    );
    return res.rows.map(r => toVocabulary(r as unknown as VocabularyRow));
  }
}
