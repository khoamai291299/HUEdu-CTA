/**
 * src/data/repositories/BaseRepository.ts
 * Mục đích: Lớp repository nền tảng (abstract) - cung cấp getAll/getById/delete chung,
 *           dùng IDatabaseService được tiêm vào. Lớp con khai báo tableName & toEntity.
 * OOP: Abstract class + generics + inheritance + DI (constructor injection).
 *      (Đặt ở tầng data vì là hạ tầng truy cập DB - tinh chỉnh so với SDD để đúng Clean Arch.)
 * Dependency: IDatabaseService, IBaseRepository.
 */
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {IBaseRepository} from '@domain/repositories/IBaseRepository';

export abstract class BaseRepository<TEntity>
  implements IBaseRepository<TEntity>
{
  constructor(protected readonly db: IDatabaseService) {}

  /** Tên bảng (cố định trong code, không phải input người dùng). */
  protected abstract get tableName(): string;

  /** Ánh xạ row -> entity. */
  protected abstract toEntity(row: Record<string, unknown>): TEntity;

  async getAll(): Promise<TEntity[]> {
    const res = await this.db.executeSql(
      `SELECT * FROM ${this.tableName} ORDER BY id ASC;`,
    );
    return res.rows.map(r => this.toEntity(r));
  }

  async getById(id: number): Promise<TEntity | null> {
    const res = await this.db.executeSql(
      `SELECT * FROM ${this.tableName} WHERE id = ?;`,
      [id],
    );
    return res.rows.length > 0 ? this.toEntity(res.rows[0]) : null;
  }

  async delete(id: number): Promise<void> {
    await this.db.executeSql(`DELETE FROM ${this.tableName} WHERE id = ?;`, [
      id,
    ]);
  }
}
