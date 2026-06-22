/**
 * src/domain/entities/ActivityCategory.ts
 * Mục đích: Thực thể danh mục hoạt động.
 * OOP: kế thừa BaseEntity.
 * Dependency: BaseEntity.
 */
import {BaseEntity} from '@core/base/BaseEntity';

export class ActivityCategory extends BaseEntity {
  public readonly nameVi: string;
  public readonly nameEn: string;
  public readonly icon: string;
  public readonly color: string;
  public readonly sortOrder: number;
  public readonly isDefault: boolean;

  constructor(params: {
    id: number;
    nameVi: string;
    nameEn: string;
    icon: string;
    color: string;
    sortOrder: number;
    isDefault: boolean;
    createdAt: number;
    updatedAt: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.nameVi = params.nameVi;
    this.nameEn = params.nameEn;
    this.icon = params.icon;
    this.color = params.color;
    this.sortOrder = params.sortOrder;
    this.isDefault = params.isDefault;
  }
}
