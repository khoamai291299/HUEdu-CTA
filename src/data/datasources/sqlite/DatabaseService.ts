/**
 * src/data/datasources/sqlite/DatabaseService.ts
 * Mục đích: Hiện thực IDatabaseService bằng react-native-sqlite-storage.
 *           Mở DB, bật foreign_keys, cung cấp executeSql/transaction, chạy migration & seed.
 *           Đây là NƠI DUY NHẤT chạm trực tiếp driver SQLite (cô lập theo rủi ro R3).
 * OOP: implements interface + encapsulation (#db private).
 * Dependency: react-native-sqlite-storage, IDatabaseService, DatabaseError, constants,
 *             MigrationRunner, Seeder.
 */
import SQLite, {
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';
import {
  IDatabaseService,
  SqlResult,
  TxExecutor,
} from '@domain/services/IDatabaseService';
import {DatabaseError} from '@core/errors/DatabaseError';
import {DB_LOCATION, DB_NAME} from '@core/constants';
import {logger} from '@core/utils/logger';
import {MigrationRunner} from './migrations/MigrationRunner';
import {Seeder} from './seed/Seeder';

SQLite.enablePromise(true);

export class DatabaseService implements IDatabaseService {
  private db: SQLiteDatabase | null = null;

  private requireDb(): SQLiteDatabase {
    if (!this.db) {
      throw new DatabaseError('Cơ sở dữ liệu chưa được khởi tạo');
    }
    return this.db;
  }

  async init(): Promise<void> {
    if (this.db) {
      return;
    }
    try {
      this.db = await SQLite.openDatabase({
        name: DB_NAME,
        location: DB_LOCATION,
      });
      await this.db.executeSql('PRAGMA foreign_keys = ON;');
      await new MigrationRunner(this).run();
      await new Seeder(this).runIfNeeded();
      logger.info('[DatabaseService] init done');
    } catch (e) {
      throw new DatabaseError('Không thể khởi tạo cơ sở dữ liệu', e);
    }
  }

  private mapResult(rs: ResultSet): SqlResult {
    const rows: Array<Record<string, unknown>> = [];
    for (let i = 0; i < rs.rows.length; i++) {
      rows.push(rs.rows.item(i) as Record<string, unknown>);
    }
    return {
      rows,
      insertId: rs.insertId,
      rowsAffected: rs.rowsAffected,
    };
  }

  async executeSql(sql: string, params: unknown[] = []): Promise<SqlResult> {
    const db = this.requireDb();
    try {
      const [rs] = await db.executeSql(sql, params);
      return this.mapResult(rs);
    } catch (e) {
      throw new DatabaseError(`Lỗi truy vấn SQL: ${sql}`, e);
    }
  }

  async transaction(
    work: (exec: TxExecutor) => Promise<void>,
  ): Promise<void> {
    const db = this.requireDb();
    const exec: TxExecutor = async (sql, params = []) => {
      const [rs] = await db.executeSql(sql, params);
      return this.mapResult(rs);
    };
    await db.executeSql('BEGIN TRANSACTION;');
    try {
      await work(exec);
      await db.executeSql('COMMIT;');
    } catch (e) {
      try {
        await db.executeSql('ROLLBACK;');
      } catch (rollbackError) {
        logger.error('[DatabaseService] rollback failed', rollbackError);
      }
      throw new DatabaseError('Giao dịch thất bại, đã hoàn tác', e);
    }
  }

  async getUserVersion(): Promise<number> {
    const result = await this.executeSql('PRAGMA user_version;');
    const value = result.rows[0]?.user_version;
    return typeof value === 'number' ? value : Number(value ?? 0);
  }

  async setUserVersion(version: number): Promise<void> {
    // PRAGMA không nhận tham số bind -> nội suy số nguyên an toàn.
    await this.executeSql(`PRAGMA user_version = ${Math.trunc(version)};`);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
