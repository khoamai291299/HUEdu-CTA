/**
 * src/data/repositories/UsageHistoryRepositoryImpl.ts
 * Mục đích: Hiện thực IUsageHistoryRepository - ghi lịch sử & tổng hợp thống kê (FR-07, FR-08).
 * Dependency: IUsageHistoryRepository, IDatabaseService, mappers, date util.
 */
import {
  DailyUsageItem,
  IUsageHistoryRepository,
  MostUsedItem,
} from '@domain/repositories/IUsageHistoryRepository';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {UsageContext, UsageRecord} from '@domain/entities/UsageRecord';
import {toUsageRecord} from '@data/mappers/mappers';
import {UsageRow} from '@data/models/rows';
import {startOfDaysAgo, toDateKey} from '@core/utils/date';

export class UsageHistoryRepositoryImpl implements IUsageHistoryRepository {
  constructor(private readonly db: IDatabaseService) {}

  async record(
    childId: number,
    vocabularyId: number,
    context: UsageContext,
  ): Promise<void> {
    await this.db.executeSql(
      `INSERT INTO usage_history (child_id, vocabulary_id, used_at, context)
       VALUES (?, ?, ?, ?);`,
      [childId, vocabularyId, Date.now(), context],
    );
  }

  async getRecent(childId: number, limit: number): Promise<UsageRecord[]> {
    const res = await this.db.executeSql(
      `SELECT * FROM usage_history
       WHERE child_id = ?
       ORDER BY used_at DESC
       LIMIT ?;`,
      [childId, limit],
    );
    return res.rows.map(r => toUsageRecord(r as unknown as UsageRow));
  }

  async getMostUsed(childId: number, limit: number, context?: UsageContext): Promise<MostUsedItem[]> {
    const isActivity = context === 'board_tap';
    const tableName = isActivity ? 'activities' : 'vocabulary';
    const ctxClause = context ? `AND u.context = '${context}'` : '';
    
    const res = await this.db.executeSql(
      `SELECT u.vocabulary_id AS vocabularyId, v.name_vi AS nameVi,
              COUNT(*) AS count
       FROM usage_history u
       INNER JOIN ${tableName} v ON v.id = u.vocabulary_id
       WHERE u.child_id = ? ${ctxClause}
       GROUP BY u.vocabulary_id
       ORDER BY count DESC
       LIMIT ?;`,
      [childId, limit],
    );
    return res.rows.map(r => ({
      vocabularyId: Number(r.vocabularyId),
      nameVi: String(r.nameVi),
      count: Number(r.count),
    }));
  }

  async getTotalCount(childId: number): Promise<number> {
    const res = await this.db.executeSql(
      'SELECT COUNT(*) AS total FROM usage_history WHERE child_id = ?;',
      [childId],
    );
    return Number(res.rows[0]?.total ?? 0);
  }

  async getDailyUsage(childId: number, days: number): Promise<DailyUsageItem[]> {
    const from = startOfDaysAgo(days - 1);
    const res = await this.db.executeSql(
      `SELECT used_at FROM usage_history
       WHERE child_id = ? AND used_at >= ?;`,
      [childId, from],
    );

    // Khởi tạo khung 'days' ngày gần nhất với count = 0.
    const buckets = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      buckets.set(toDateKey(startOfDaysAgo(i)), 0);
    }
    for (const row of res.rows) {
      const key = toDateKey(Number(row.used_at));
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    }
    return Array.from(buckets.entries()).map(([dateKey, count]) => ({
      dateKey,
      count,
    }));
  }

  async clearForChild(childId: number): Promise<void> {
    await this.db.executeSql('DELETE FROM usage_history WHERE child_id = ?;', [
      childId,
    ]);
  }
}
