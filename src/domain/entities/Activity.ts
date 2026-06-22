/**
 * src/domain/entities/Activity.ts
 * Mục đích: Thực thể hoạt động giao tiếp chính (tên VI/EN, hình ảnh, danh mục, văn bản đọc).
 * OOP: kế thừa BaseEntity.
 * Dependency: BaseEntity.
 */
import {BaseEntity} from '@core/base/BaseEntity';

export class Activity extends BaseEntity {
  public readonly nameVi: string;
  public readonly nameEn: string | null;
  public readonly imagePath: string | null;
  public readonly categoryId: number;
  public readonly speechTextVi: string | null;
  public readonly speechTextEn: string | null;
  public readonly isDefault: boolean;
  public readonly sortOrder: number;

  constructor(params: {
    id: number;
    nameVi: string;
    nameEn?: string | null;
    imagePath?: string | null;
    categoryId: number;
    speechTextVi?: string | null;
    speechTextEn?: string | null;
    isDefault: boolean;
    sortOrder: number;
    createdAt: number;
    updatedAt: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.nameVi = params.nameVi;
    this.nameEn = params.nameEn ?? null;
    this.imagePath = params.imagePath ?? null;
    this.categoryId = params.categoryId;
    this.speechTextVi = params.speechTextVi ?? null;
    this.speechTextEn = params.speechTextEn ?? null;
    this.isDefault = params.isDefault;
    this.sortOrder = params.sortOrder;
  }

  /** Văn bản dùng cho TTS theo ngôn ngữ; mặc định lấy theo tên. */
  speechText(lang: 'vi' | 'en'): string {
    if (lang === 'en') {
      return this.speechTextEn ?? this.nameEn ?? this.nameVi;
    }
    return this.speechTextVi ?? this.nameVi;
  }

  /** Nhãn hiển thị theo ngôn ngữ. */
  label(lang: 'vi' | 'en'): string {
    return lang === 'en' ? this.nameEn ?? this.nameVi : this.nameVi;
  }
}
