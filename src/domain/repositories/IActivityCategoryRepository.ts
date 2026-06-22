/**
 * src/domain/repositories/IActivityCategoryRepository.ts
 * Mục đích: Hợp đồng truy cập danh mục hoạt động.
 * Dependency: ActivityCategory, IBaseRepository.
 */
import {ActivityCategory} from '@domain/entities/ActivityCategory';
import {IBaseRepository} from './IBaseRepository';

export interface ActivityCategoryInput {
  nameVi: string;
  nameEn: string;
  icon: string;
  color: string;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface IActivityCategoryRepository extends IBaseRepository<ActivityCategory> {
  create(input: ActivityCategoryInput): Promise<ActivityCategory>;
  update(id: number, input: Partial<ActivityCategoryInput>): Promise<ActivityCategory>;
}
