/**
 * src/data/repositories/CategoryRepositoryImpl.ts
 * Mục đích: Hiện thực ICategoryRepository trên SQLite.
 * OOP: extends BaseRepository<Category>, implements ICategoryRepository (polymorphism).
 * Dependency: BaseRepository, ICategoryRepository, mappers, DatabaseError, IDatabaseService.
 */
import {BaseRepository} from './BaseRepository';
import {Category} from '@domain/entities/Category';
import {
  CategoryInput,
  ICategoryRepository,
} from '@domain/repositories/ICategoryRepository';
import {toCategory} from '@data/mappers/mappers';
import {CategoryRow} from '@data/models/rows';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';

export class CategoryRepositoryImpl
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(db: IDatabaseService) {
    super(db);
  }

  protected get tableName(): string {
    return 'categories';
  }

  protected toEntity(row: Record<string, unknown>): Category {
    return toCategory(row as unknown as CategoryRow);
  }

  async getAll(): Promise<Category[]> {
    const res = await this.db.executeSql(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC;',
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async create(input: CategoryInput): Promise<Category> {
    const ts = Date.now();
    const res = await this.db.executeSql(
      `INSERT INTO categories
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
      throw new DatabaseError('Không tạo được danh mục');
    }
    return created;
  }

  async update(id: number, input: Partial<CategoryInput>): Promise<Category> {
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
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?;`,
      values,
    );
    const updated = await this.getById(id);
    if (!updated) {
      throw new DatabaseError('Không cập nhật được danh mục');
    }
    return updated;
  }
}
