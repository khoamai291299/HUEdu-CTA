/**
 * src/domain/repositories/IUsageHistoryRepository.ts
 * Mục đích: Hợp đồng ghi/đọc lịch sử sử dụng + dữ liệu thống kê.
 * Dependency: UsageRecord.
 */
import {UsageContext, UsageRecord} from '@domain/entities/UsageRecord';

export interface MostUsedItem {
  vocabularyId: number;
  nameVi: string;
  count: number;
}

export interface DailyUsageItem {
  dateKey: string; // YYYY-MM-DD
  count: number;
}

export interface IUsageHistoryRepository {
  record(
    childId: number,
    vocabularyId: number,
    context: UsageContext,
  ): Promise<void>;
  getRecent(childId: number, limit: number): Promise<UsageRecord[]>;
  getMostUsed(childId: number, limit: number, context?: UsageContext): Promise<MostUsedItem[]>;
  getTotalCount(childId: number): Promise<number>;
  getDailyUsage(childId: number, days: number): Promise<DailyUsageItem[]>;
  clearForChild(childId: number): Promise<void>;
}
