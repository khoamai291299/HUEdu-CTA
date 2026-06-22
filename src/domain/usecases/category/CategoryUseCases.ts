/**
 * src/domain/usecases/category/CategoryUseCases.ts
 * Mục đích: Use case quản lý danh mục (FR-04).
 * Dependency: BaseUseCase, ICategoryRepository, Category, DomainError, validators.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {
  CategoryInput,
  ICategoryRepository,
} from '@domain/repositories/ICategoryRepository';
import {Category} from '@domain/entities/Category';
import {DomainError} from '@core/errors/AppError';
import {isNonEmpty} from '@core/utils/validators';

export class GetCategoriesUseCase extends BaseUseCase<NoParams, Category[]> {
  constructor(private readonly repo: ICategoryRepository) {
    super();
  }
  execute(): Promise<Category[]> {
    return this.repo.getAll();
  }
}

export class AddCategoryUseCase extends BaseUseCase<CategoryInput, Category> {
  constructor(private readonly repo: ICategoryRepository) {
    super();
  }
  execute(input: CategoryInput): Promise<Category> {
    if (!isNonEmpty(input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên danh mục không được rỗng');
    }
    return this.repo.create(input);
  }
}

export class UpdateCategoryUseCase extends BaseUseCase<
  {id: number; input: Partial<CategoryInput>},
  Category
> {
  constructor(private readonly repo: ICategoryRepository) {
    super();
  }
  execute(params: {
    id: number;
    input: Partial<CategoryInput>;
  }): Promise<Category> {
    return this.repo.update(params.id, params.input);
  }
}

export class DeleteCategoryUseCase extends BaseUseCase<number, void> {
  constructor(private readonly repo: ICategoryRepository) {
    super();
  }
  execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
