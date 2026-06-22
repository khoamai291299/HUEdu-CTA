/**
 * src/domain/repositories/IChildRepository.ts
 * Mục đích: Hợp đồng truy cập hồ sơ trẻ.
 * Dependency: Child, IBaseRepository.
 */
import {Child} from '@domain/entities/Child';
import {IBaseRepository} from './IBaseRepository';

export interface ChildInput {
  name: string;
  avatarPath?: string | null;
}

export interface IChildRepository extends IBaseRepository<Child> {
  create(input: ChildInput): Promise<Child>;
  update(id: number, input: Partial<ChildInput>): Promise<Child>;
}
