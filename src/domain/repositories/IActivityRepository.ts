/**
 * src/domain/repositories/IActivityRepository.ts
 * Mục đích: Hợp đồng truy cập hoạt động (CRUD + tìm kiếm + theo danh mục).
 * Dependency: Activity, IBaseRepository.
 */
import {Activity} from '@domain/entities/Activity';
import {IBaseRepository} from './IBaseRepository';

export interface ActivityInput {
  nameVi: string;
  nameEn?: string | null;
  imagePath?: string | null;
  speechTextVi?: string | null;
  speechTextEn?: string | null;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface IActivityRepository extends IBaseRepository<Activity> {
  create(input: ActivityInput): Promise<Activity>;
  update(id: number, input: Partial<ActivityInput>): Promise<Activity>;
  getAll(): Promise<Activity[]>;
  getById(id: number): Promise<Activity | null>;
  search(query: string): Promise<Activity[]>;
}
