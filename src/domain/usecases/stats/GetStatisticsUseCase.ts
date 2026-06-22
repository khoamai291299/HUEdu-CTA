/**
 * src/domain/usecases/stats/GetStatisticsUseCase.ts
 * Mục đích: Tổng hợp dữ liệu cho Statistics Dashboard (FR-08):
 *           từ dùng nhiều nhất, tổng lượt, thống kê theo ngày.
 * Dependency: BaseUseCase, IUsageHistoryRepository.
 */
import {BaseUseCase} from '@core/base/BaseUseCase';
import {
  DailyUsageItem,
  IUsageHistoryRepository,
  MostUsedItem,
} from '@domain/repositories/IUsageHistoryRepository';

export interface StatisticsResult {
  totalCount: number;
  mostUsed: MostUsedItem[];
  daily: DailyUsageItem[];
}

export class GetStatisticsUseCase extends BaseUseCase<
  {childId: number; days?: number; topN?: number},
  StatisticsResult
> {
  constructor(private readonly repo: IUsageHistoryRepository) {
    super();
  }
  async execute(params: {
    childId: number;
    days?: number;
    topN?: number;
  }): Promise<StatisticsResult> {
    const days = params.days ?? 7;
    const topN = params.topN ?? 5;
    const [totalCount, mostUsed, daily] = await Promise.all([
      this.repo.getTotalCount(params.childId),
      this.repo.getMostUsed(params.childId, topN, 'sentence_speak'),
      this.repo.getDailyUsage(params.childId, days),
    ]);
    return {totalCount, mostUsed, daily};
  }
}
