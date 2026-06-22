/**
 * src/data/repositories/ActivityCategoryRepositoryImpl.ts
 * Mục đích: Hiện thực IActivityCategoryRepository trên SQLite.
 * OOP: extends BaseRepository<ActivityCategory>, implements IActivityCategoryRepository.
 * Dependency: BaseRepository, IActivityCategoryRepository, mappers, DatabaseError, IDatabaseService.
 */
import {BaseRepository} from './BaseRepository';
import {ActivityCategory} from '@domain/entities/ActivityCategory';
import {
  ActivityCategoryInput,
  IActivityCategoryRepository,
} from '@domain/repositories/IActivityCategoryRepository';
import {toActivityCategory} from '@data/mappers/mappers';
import {ActivityCategoryRow} from '@data/models/rows';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';

export class ActivityCategoryRepositoryImpl
  extends BaseRepository<ActivityCategory>
  implements IActivityCategoryRepository
{
  constructor(db: IDatabaseService) {
    super(db);
  }

  protected get tableName(): string {
    return 'activity_categories';
  }

  protected toEntity(row: Record<string, unknown>): ActivityCategory {
    return toActivityCategory(row as unknown as ActivityCategoryRow);
  }

  async getAll(): Promise<ActivityCategory[]> {
    const res = await this.db.executeSql(
      'SELECT * FROM activity_categories ORDER BY sort_order ASC, id ASC;',
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async create(input: ActivityCategoryInput): Promise<ActivityCategory> {
    const ts = Date.now();
    const res = await this.db.executeSql(
      `INSERT INTO activity_categories
        (name_vi, name_en, icon, color, sort_order, is_default, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        input.nameVi,
        input.nameEn,
        input.icon,
        input.color,
        input.sortOrder ?? 0,
        input.isDefault ? 1 : 0,
        ts,
        ts,
      ],
    );
    const created = await this.getById(res.insertId as number);
    if (!created) {
      throw new DatabaseError('Không tạo được danh mục hoạt động');
    }
    return created;
  }

  async update(id: number, input: Partial<ActivityCategoryInput>): Promise<ActivityCategory> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const map: Record<string, unknown> = {
      name_vi: input.nameVi,
      name_en: input.nameEn,
      icon: input.icon,
      color: input.color,
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
      `UPDATE activity_categories SET ${fields.join(', ')} WHERE id = ?;`,
      values,
    );
    const updated = await this.getById(id);
    if (!updated) {
      throw new DatabaseError('Không cập nhật được danh mục hoạt động');
    }
    return updated;
  }
}
