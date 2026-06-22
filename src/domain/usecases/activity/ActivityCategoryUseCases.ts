/**
 * src/domain/usecases/activity/ActivityCategoryUseCases.ts
 * Mục đích: Use case quản lý danh mục hoạt động.
 * Dependency: BaseUseCase, IActivityCategoryRepository, ActivityCategory, DomainError, validators.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {
  ActivityCategoryInput,
  IActivityCategoryRepository,
} from '@domain/repositories/IActivityCategoryRepository';
import {ActivityCategory} from '@domain/entities/ActivityCategory';
import {DomainError} from '@core/errors/AppError';
import {isNonEmpty} from '@core/utils/validators';

export class GetActivityCategoriesUseCase extends BaseUseCase<NoParams, ActivityCategory[]> {
  constructor(private readonly repo: IActivityCategoryRepository) {
    super();
  }
  execute(): Promise<ActivityCategory[]> {
    return this.repo.getAll();
  }
}

export class AddActivityCategoryUseCase extends BaseUseCase<ActivityCategoryInput, ActivityCategory> {
  constructor(private readonly repo: IActivityCategoryRepository) {
    super();
  }
  execute(input: ActivityCategoryInput): Promise<ActivityCategory> {
    if (!isNonEmpty(input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên danh mục không được rỗng');
    }
    return this.repo.create(input);
  }
}

export class UpdateActivityCategoryUseCase extends BaseUseCase<
  {id: number; input: Partial<ActivityCategoryInput>},
  ActivityCategory
> {
  constructor(private readonly repo: IActivityCategoryRepository) {
    super();
  }
  execute(params: {
    id: number;
    input: Partial<ActivityCategoryInput>;
  }): Promise<ActivityCategory> {
    return this.repo.update(params.id, params.input);
  }
}

export class DeleteActivityCategoryUseCase extends BaseUseCase<number, void> {
  constructor(private readonly repo: IActivityCategoryRepository) {
    super();
  }
  execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
