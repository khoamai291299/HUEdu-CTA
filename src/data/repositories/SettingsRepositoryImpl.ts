/**
 * src/data/repositories/SettingsRepositoryImpl.ts
 * Mục đích: Hiện thực ISettingsRepository - lưu cấu hình dạng key-value (upsert).
 * Dependency: ISettingsRepository, IDatabaseService.
 */
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {IDatabaseService} from '@domain/services/IDatabaseService';

export class SettingsRepositoryImpl implements ISettingsRepository {
  constructor(private readonly db: IDatabaseService) {}

  async get(key: string): Promise<string | null> {
    const res = await this.db.executeSql(
      'SELECT value FROM settings WHERE key = ?;',
      [key],
    );
    return res.rows.length > 0 ? String(res.rows[0].value) : null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.executeSql(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?);`,
      [key, value, Date.now()],
    );
  }

  async getAll(): Promise<Record<string, string>> {
    const res = await this.db.executeSql('SELECT key, value FROM settings;');
    const out: Record<string, string> = {};
    for (const row of res.rows) {
      out[String(row.key)] = String(row.value);
    }
    return out;
  }

  async remove(key: string): Promise<void> {
    await this.db.executeSql('DELETE FROM settings WHERE key = ?;', [key]);
  }
}
