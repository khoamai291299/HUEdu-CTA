/**
 * __tests__/CategoryRepository.test.ts
 * Mục đích: Kiểm thử repository (CategoryRepositoryImpl) với IDatabaseService giả lập:
 *           xác minh ánh xạ row->entity và luồng create (INSERT + getById).
 */
import {CategoryRepositoryImpl} from '@data/repositories/CategoryRepositoryImpl';
import {
  IDatabaseService,
  SqlResult,
  TxExecutor,
} from '@domain/services/IDatabaseService';

type Responder = (sql: string, params: unknown[]) => SqlResult;

class FakeDatabaseService implements IDatabaseService {
  public calls: Array<{sql: string; params: unknown[]}> = [];
  constructor(private readonly responder: Responder) {}
  async init(): Promise<void> {}
  async executeSql(sql: string, params: unknown[] = []): Promise<SqlResult> {
    this.calls.push({sql, params});
    return this.responder(sql, params);
  }
  async transaction(work: (exec: TxExecutor) => Promise<void>): Promise<void> {
    await work((sql, params = []) => this.executeSql(sql, params));
  }
  async getUserVersion(): Promise<number> {
    return 1;
  }
  async setUserVersion(): Promise<void> {}
  async close(): Promise<void> {}
}

const buildRow = (id: number, nameVi: string) => ({
  id,
  name_vi: nameVi,
  name_en: 'Food',
  icon: 'Utensils',
  color: '#F2B5A0',
  sort_order: 1,
  is_default: 1,
  created_at: 1000,
  updated_at: 1000,
});

describe('CategoryRepositoryImpl', () => {
  it('getAll ánh xạ row sang entity Category', async () => {
    const db = new FakeDatabaseService(() => ({
      rows: [buildRow(1, 'Đồ ăn'), buildRow(2, 'Đồ uống')],
      rowsAffected: 0,
    }));
    const repo = new CategoryRepositoryImpl(db);

    const result = await repo.getAll();

    expect(result).toHaveLength(2);
    expect(result[0].nameVi).toBe('Đồ ăn');
    expect(result[0].isDefault).toBe(true);
    expect(db.calls[0].sql).toContain('ORDER BY sort_order');
  });

  it('create chèn INSERT rồi trả về entity qua getById', async () => {
    const db = new FakeDatabaseService((sql: string) => {
      if (sql.includes('INSERT')) {
        return {rows: [], insertId: 9, rowsAffected: 1};
      }
      return {rows: [buildRow(9, 'Mới')], rowsAffected: 0};
    });
    const repo = new CategoryRepositoryImpl(db);

    const created = await repo.create({
      nameVi: 'Mới',
      nameEn: 'New',
      icon: 'Star',
      color: '#000000',
    });

    expect(created.id).toBe(9);
    expect(created.nameVi).toBe('Mới');
    expect(db.calls.some(c => c.sql.includes('INSERT INTO categories'))).toBe(
      true,
    );
  });
});
