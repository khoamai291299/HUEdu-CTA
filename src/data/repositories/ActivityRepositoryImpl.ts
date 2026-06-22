/**
 * src/data/repositories/ActivityRepositoryImpl.ts
 * Mục đích: Hiện thực IActivityRepository trên SQLite.
 * OOP: extends BaseRepository<Activity>, implements IActivityRepository.
 * Dependency: BaseRepository, IActivityRepository, mappers, DatabaseError, IDatabaseService.
 */
import {BaseRepository} from './BaseRepository';
import {Activity} from '@domain/entities/Activity';
import {
  IActivityRepository,
  ActivityInput,
} from '@domain/repositories/IActivityRepository';
import {toActivity} from '@data/mappers/mappers';
import {ActivityRow} from '@data/models/rows';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';

export class ActivityRepositoryImpl
  extends BaseRepository<Activity>
  implements IActivityRepository
{
  constructor(db: IDatabaseService) {
    super(db);
  }

  protected get tableName(): string {
    return 'activities';
  }

  protected toEntity(row: Record<string, unknown>): Activity {
    return toActivity(row as unknown as ActivityRow);
  }

  async getAll(): Promise<Activity[]> {
    const res = await this.db.executeSql(
      'SELECT * FROM activities ORDER BY sort_order ASC, id ASC;',
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async getByCategory(categoryId: number): Promise<Activity[]> {
    const res = await this.db.executeSql(
      'SELECT * FROM activities WHERE category_id = ? ORDER BY sort_order ASC, id ASC;',
      [categoryId],
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async search(query: string): Promise<Activity[]> {
    const like = `%${query}%`;
    const res = await this.db.executeSql(
      `SELECT * FROM activities
       WHERE name_vi LIKE ? OR name_en LIKE ?
       ORDER BY name_vi ASC;`,
      [like, like],
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async create(input: ActivityInput): Promise<Activity> {
    const ts = Date.now();
    const res = await this.db.executeSql(
      `INSERT INTO activities
        (name_vi, name_en, image_path, category_id, speech_text_vi, speech_text_en,
         is_default, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        input.nameVi,
        input.nameEn ?? null,
        input.imagePath ?? null,
        input.categoryId,
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
      throw new DatabaseError('Không tạo được hoạt động');
    }
    return created;
  }

  async update(id: number, input: Partial<ActivityInput>): Promise<Activity> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const map: Record<string, unknown> = {
      name_vi: input.nameVi,
      name_en: input.nameEn,
      image_path: input.imagePath,
      category_id: input.categoryId,
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
      `UPDATE activities SET ${fields.join(', ')} WHERE id = ?;`,
      values,
    );
    const updated = await this.getById(id);
    if (!updated) {
      throw new DatabaseError('Không cập nhật được hoạt động');
    }
    return updated;
  }
}
