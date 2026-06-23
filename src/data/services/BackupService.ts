/**
 * src/data/services/BackupService.ts
 * Mục đích: Hiện thực IBackupService - xuất toàn bộ dữ liệu ra JSON/file và khôi phục
 *           (ghi đè trong giao dịch) (FR-15). Cô lập phụ thuộc react-native-fs.
 * OOP: implements IBackupService, DI IDatabaseService qua constructor.
 * Dependency: react-native-fs, IBackupService, IDatabaseService, constants, AppError, logger.
 */
import RNFS from 'react-native-fs';
import {
  BackupPayload,
  IBackupService,
} from '@domain/services/IBackupService';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {BACKUP_FORMAT} from '@core/constants';
import {DomainError} from '@core/errors/AppError';
import {logger} from '@core/utils/logger';

export class BackupService implements IBackupService {
  constructor(private readonly db: IDatabaseService) {}

  private async dump(table: string): Promise<Array<Record<string, unknown>>> {
    const res = await this.db.executeSql(`SELECT * FROM ${table};`);
    return res.rows;
  }

  async exportToJson(): Promise<string> {
    const [
      children,
      vocabulary,
      activities,
      favorites,
      usageHistory,
      settingsRows,
    ] = await Promise.all([
      this.dump('children'),
      this.dump('vocabulary'),
      this.dump('activities'),
      this.dump('favorites'),
      this.dump('usage_history'),
      this.dump('settings'),
    ]);

    const settings: Record<string, string> = {};
    for (const row of settingsRows) {
      settings[String(row.key)] = String(row.value);
    }

    const payload = {
      app: BACKUP_FORMAT.APP,
      version: BACKUP_FORMAT.VERSION,
      exportedAt: Date.now(),
      data: {children, categories: [], vocabulary, activities, favorites, usageHistory, settings},
    };
    return JSON.stringify(payload, null, 2);
  }

  async exportToFile(): Promise<string> {
    const json = await this.exportToJson();
    const fileName = `huedu-cta-backup-${Date.now()}.json`;
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, json, 'utf8');
    logger.info('[BackupService] exported to', path);
    return path;
  }

  async importFromJson(json: string): Promise<void> {
    let payload: BackupPayload;
    try {
      payload = JSON.parse(json) as BackupPayload;
    } catch (e) {
      throw new DomainError('BACKUP', 'Tệp sao lưu không hợp lệ (JSON lỗi)', e);
    }
    if (payload.app !== BACKUP_FORMAT.APP) {
      throw new DomainError('BACKUP', 'Tệp sao lưu không thuộc HUEdu-CTA');
    }
    if (payload.version > BACKUP_FORMAT.VERSION) {
      throw new DomainError(
        'BACKUP',
        'Tệp sao lưu thuộc phiên bản mới hơn, không tương thích',
      );
    }

    const d = payload.data;
    await this.db.transaction(async exec => {
      // Xoá theo thứ tự tôn trọng khoá ngoại.
      await exec('DELETE FROM usage_history;');
      await exec('DELETE FROM favorites;');
      await exec('DELETE FROM vocabulary;');
      await exec('DELETE FROM activities;');
      await exec('DELETE FROM children;');
      await exec('DELETE FROM settings;');

      for (const c of d.children as Array<Record<string, unknown>>) {
        await exec(
          `INSERT INTO children (id, name, avatar_path, skin_tone, region, diagnosis, birth_year, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [c.id, c.name, c.avatar_path ?? null, c.skin_tone ?? 'pale', c.region ?? 'North', c.diagnosis ?? 'Unknown', c.birth_year ?? 2020, c.created_at, c.updated_at],
        );
      }
      for (const v of d.vocabulary as Array<Record<string, unknown>>) {
        await exec(
          `INSERT INTO vocabulary
            (id, name_vi, image_path, speech_text_vi,
             is_default, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            v.id,
            v.name_vi,
            v.image_path ?? null,
            v.speech_text_vi ?? null,
            v.is_default,
            v.sort_order,
            v.created_at,
            v.updated_at,
          ],
        );
      }
      for (const a of (d.activities ?? []) as Array<Record<string, unknown>>) {
        await exec(
          `INSERT INTO activities
            (id, name_vi, image_path, speech_text_vi,
             is_default, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            a.id,
            a.name_vi,
            a.image_path ?? null,
            a.speech_text_vi ?? null,
            a.is_default,
            a.sort_order,
            a.created_at,
            a.updated_at,
          ],
        );
      }
      for (const f of d.favorites as Array<Record<string, unknown>>) {
        await exec(
          `INSERT INTO favorites (id, child_id, vocabulary_id, created_at)
           VALUES (?, ?, ?, ?);`,
          [f.id, f.child_id, f.vocabulary_id, f.created_at],
        );
      }
      for (const u of d.usageHistory as Array<Record<string, unknown>>) {
        await exec(
          `INSERT INTO usage_history (id, child_id, vocabulary_id, used_at, context)
           VALUES (?, ?, ?, ?, ?);`,
          [u.id, u.child_id, u.vocabulary_id, u.used_at, u.context],
        );
      }
      const ts = Date.now();
      for (const [key, value] of Object.entries(d.settings ?? {})) {
        await exec(
          `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?);`,
          [key, value, ts],
        );
      }
    });
    logger.info('[BackupService] import done');
  }
}

