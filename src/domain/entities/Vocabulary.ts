/**
 * src/domain/entities/Vocabulary.ts
 * Mục đích: Thực thể từ vựng giao tiếp (tên VI, hình ảnh, văn bản đọc).
 * OOP: kế thừa BaseEntity; phương thức nghiệp vụ speechText() (encapsulation).
 * Dependency: BaseEntity.
 */
import {BaseEntity} from '@core/base/BaseEntity';

export class Vocabulary extends BaseEntity {
  public readonly nameVi: string;
  public readonly imagePath: string | null;
  public readonly speechTextVi: string | null;
  public readonly categoryKey: string | null;
  public readonly isDefault: boolean;
  public readonly sortOrder: number;
  public readonly isCustom: boolean;
  public readonly audioPath: string | null;

  constructor(params: {
    id: number;
    nameVi: string;
    imagePath?: string | null;
    speechTextVi?: string | null;
    categoryKey?: string | null;
    isDefault: boolean;
    sortOrder: number;
    isCustom?: boolean;
    audioPath?: string | null;
    createdAt: number;
    updatedAt: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.nameVi = params.nameVi;
    this.imagePath = params.imagePath ?? null;
    this.speechTextVi = params.speechTextVi ?? null;
    this.categoryKey = params.categoryKey ?? null;
    this.isDefault = params.isDefault;
    this.sortOrder = params.sortOrder;
    this.isCustom = params.isCustom ?? false;
    this.audioPath = params.audioPath ?? null;
  }

  /** Văn bản dùng cho TTS; mặc định lấy theo tên. */
  speechText(): string {
    return this.speechTextVi ?? this.nameVi;
  }

  /** Nhãn hiển thị. */
  label(): string {
    return this.nameVi;
  }
}
