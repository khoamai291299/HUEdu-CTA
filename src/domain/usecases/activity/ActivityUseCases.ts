/**
 * src/domain/usecases/activity/ActivityUseCases.ts
 * Mục đích: Use case CRUD + tìm kiếm hoạt động.
 * Dependency: BaseUseCase, IActivityRepository, Activity, DomainError, validators.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {
  IActivityRepository,
  ActivityInput,
} from '@domain/repositories/IActivityRepository';
import {Activity} from '@domain/entities/Activity';
import {DomainError} from '@core/errors/AppError';
import {isNonEmpty} from '@core/utils/validators';

export class GetAllActivityUseCase extends BaseUseCase<NoParams, Activity[]> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(): Promise<Activity[]> {
    return this.repo.getAll();
  }
}

export class GetActivityByCategoryUseCase extends BaseUseCase<
  number,
  Activity[]
> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(categoryId: number): Promise<Activity[]> {
    return this.repo.getByCategory(categoryId);
  }
}

export class SearchActivityUseCase extends BaseUseCase<string, Activity[]> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(query: string): Promise<Activity[]> {
    const q = query.trim();
    if (q.length === 0) {
      return this.repo.getAll();
    }
    return this.repo.search(q);
  }
}

export class AddActivityUseCase extends BaseUseCase<
  ActivityInput,
  Activity
> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(input: ActivityInput): Promise<Activity> {
    if (!isNonEmpty(input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên hoạt động không được rỗng');
    }
    return this.repo.create(input);
  }
}

export class UpdateActivityUseCase extends BaseUseCase<
  {id: number; input: Partial<ActivityInput>},
  Activity
> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(params: {
    id: number;
    input: Partial<ActivityInput>;
  }): Promise<Activity> {
    if (params.input.nameVi !== undefined && !isNonEmpty(params.input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên hoạt động không được rỗng');
    }
    return this.repo.update(params.id, params.input);
  }
}

export class DeleteActivityUseCase extends BaseUseCase<number, void> {
  constructor(private readonly repo: IActivityRepository) {
    super();
  }
  execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
