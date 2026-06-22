/**
 * src/domain/entities/Child.ts
 * Mục đích: Thực thể hồ sơ trẻ (tên, avatar). Favorites & history liên kết qua repository.
 * OOP: kế thừa BaseEntity.
 * Dependency: BaseEntity.
 */
import {BaseEntity} from '@core/base/BaseEntity';

export class Child extends BaseEntity {
  public readonly name: string;
  public readonly avatarPath: string | null;

  constructor(params: {
    id: number;
    name: string;
    avatarPath?: string | null;
    createdAt: number;
    updatedAt: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.name = params.name;
    this.avatarPath = params.avatarPath ?? null;
  }
}
