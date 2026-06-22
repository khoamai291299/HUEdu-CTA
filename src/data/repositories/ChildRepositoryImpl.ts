/**
 * src/data/repositories/ChildRepositoryImpl.ts
 * Mục đích: Hiện thực IChildRepository trên SQLite.
 * OOP: extends BaseRepository<Child>, implements IChildRepository.
 * Dependency: BaseRepository, IChildRepository, mappers, DatabaseError, IDatabaseService.
 */
import {BaseRepository} from './BaseRepository';
import {Child} from '@domain/entities/Child';
import {ChildInput, IChildRepository} from '@domain/repositories/IChildRepository';
import {toChild} from '@data/mappers/mappers';
import {ChildRow} from '@data/models/rows';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';

export class ChildRepositoryImpl
  extends BaseRepository<Child>
  implements IChildRepository
{
  constructor(db: IDatabaseService) {
    super(db);
  }

  protected get tableName(): string {
    return 'children';
  }

  protected toEntity(row: Record<string, unknown>): Child {
    return toChild(row as unknown as ChildRow);
  }

  async create(input: ChildInput): Promise<Child> {
    const ts = Date.now();
    const res = await this.db.executeSql(
      `INSERT INTO children (name, avatar_path, created_at, updated_at)
       VALUES (?, ?, ?, ?);`,
      [input.name, input.avatarPath ?? null, ts, ts],
    );
    const created = await this.getById(res.insertId as number);
    if (!created) {
      throw new DatabaseError('Không tạo được hồ sơ trẻ');
    }
    return created;
  }

  async update(id: number, input: Partial<ChildInput>): Promise<Child> {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name);
    }
    if (input.avatarPath !== undefined) {
      fields.push('avatar_path = ?');
      values.push(input.avatarPath);
    }
    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id);
    await this.db.executeSql(
      `UPDATE children SET ${fields.join(', ')} WHERE id = ?;`,
      values,
    );
    const updated = await this.getById(id);
    if (!updated) {
      throw new DatabaseError('Không cập nhật được hồ sơ trẻ');
    }
    return updated;
  }
}
