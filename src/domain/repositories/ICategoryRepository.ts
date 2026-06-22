/**
 * src/domain/repositories/ICategoryRepository.ts
 * Mục đích: Hợp đồng truy cập danh mục.
 * Dependency: Category, IBaseRepository.
 */
import {Category} from '@domain/entities/Category';
import {IBaseRepository} from './IBaseRepository';

export interface CategoryInput {
  nameVi: string;
  nameEn: string;
  icon: string;
  color: string;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface ICategoryRepository extends IBaseRepository<Category> {
  create(input: CategoryInput): Promise<Category>;
  update(id: number, input: Partial<CategoryInput>): Promise<Category>;
}
