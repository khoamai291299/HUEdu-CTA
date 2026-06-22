/**
 * src/domain/usecases/usage/UsageUseCases.ts
 * Mục đích: Use case ghi & đọc lịch sử sử dụng (FR-07).
 * Dependency: BaseUseCase, IUsageHistoryRepository, UsageRecord.
 */
import {BaseUseCase} from '@core/base/BaseUseCase';
import {IUsageHistoryRepository} from '@domain/repositories/IUsageHistoryRepository';
import {UsageContext, UsageRecord} from '@domain/entities/UsageRecord';

export class RecordUsageUseCase extends BaseUseCase<
  {childId: number; vocabularyId: number; context: UsageContext},
  void
> {
  constructor(private readonly repo: IUsageHistoryRepository) {
    super();
  }
  execute(params: {
    childId: number;
    vocabularyId: number;
    context: UsageContext;
  }): Promise<void> {
    return this.repo.record(
      params.childId,
      params.vocabularyId,
      params.context,
    );
  }
}

export class GetRecentUsageUseCase extends BaseUseCase<
  {childId: number; limit: number},
  UsageRecord[]
> {
  constructor(private readonly repo: IUsageHistoryRepository) {
    super();
  }
  execute(params: {childId: number; limit: number}): Promise<UsageRecord[]> {
    return this.repo.getRecent(params.childId, params.limit);
  }
}
