/**
 * src/data/repositories/VocabularyRepositoryImpl.ts
 * Mục đích: Hiện thực IVocabularyRepository (CRUD + tìm kiếm + theo danh mục) trên SQLite.
 * OOP: extends BaseRepository<Vocabulary>, implements IVocabularyRepository.
 * Dependency: BaseRepository, IVocabularyRepository, mappers, DatabaseError, IDatabaseService.
 */
import {BaseRepository} from './BaseRepository';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {
  IVocabularyRepository,
  VocabularyInput,
} from '@domain/repositories/IVocabularyRepository';
import {toVocabulary} from '@data/mappers/mappers';
import {VocabularyRow} from '@data/models/rows';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';

export class VocabularyRepositoryImpl
  extends BaseRepository<Vocabulary>
  implements IVocabularyRepository
{
  constructor(db: IDatabaseService) {
    super(db);
  }

  protected get tableName(): string {
    return 'vocabulary';
  }

  protected toEntity(row: Record<string, unknown>): Vocabulary {
    return toVocabulary(row as unknown as VocabularyRow);
  }

  async getAll(): Promise<Vocabulary[]> {
    const res = await this.db.executeSql(
      'SELECT * FROM vocabulary ORDER BY sort_order ASC, id ASC;',
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async search(query: string): Promise<Vocabulary[]> {
    const like = `%${query}%`;
    const res = await this.db.executeSql(
      `SELECT * FROM vocabulary
       WHERE name_vi LIKE ? OR name_en LIKE ?
       ORDER BY name_vi ASC;`,
      [like, like],
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async create(input: VocabularyInput): Promise<Vocabulary> {
    const ts = Date.now();
    const res = await this.db.executeSql(
      `INSERT INTO vocabulary
        (name_vi, name_en, image_path, speech_text_vi, speech_text_en,
         is_default, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        input.nameVi,
        input.nameEn ?? null,
        input.imagePath ?? null,
        input.speechTextVi ?? null,
        input.speechTextEn ?? null,
        input.isDefault ? 1 : 0,
        input.sortOrder ?? 0,
        ts,
        ts,
      ],
    );
    const created = await this.getById(res.insertId as number);
    if (!created) {
      throw new DatabaseError('Không tạo được từ vựng');
    }
    return created;
  }

  async update(id: number, input: Partial<VocabularyInput>): Promise<Vocabulary> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const map: Record<string, unknown> = {
      name_vi: input.nameVi,
      name_en: input.nameEn,
      image_path: input.imagePath,
      speech_text_vi: input.speechTextVi,
      speech_text_en: input.speechTextEn,
      sort_order: input.sortOrder,
    };
    for (const [col, val] of Object.entries(map)) {
      if (val !== undefined) {
        fields.push(`${col} = ?`);
        values.push(val);
      }
    }
    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id);
    await this.db.executeSql(
      `UPDATE vocabulary SET ${fields.join(', ')} WHERE id = ?;`,
      values,
    );
    const updated = await this.getById(id);
    if (!updated) {
      throw new DatabaseError('Không cập nhật được từ vựng');
    }
    return updated;
  }
}
