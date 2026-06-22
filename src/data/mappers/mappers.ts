/**
 * src/data/mappers/mappers.ts
 * Mục đích: Chuyển đổi Row (DB) <-> Entity (domain). Một nơi duy nhất giữ logic ánh xạ.
 * Dependency: entities, row models.
 */
import {Category} from '@domain/entities/Category';
import {Child} from '@domain/entities/Child';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {UsageContext, UsageRecord} from '@domain/entities/UsageRecord';
import {Activity} from '@domain/entities/Activity';
import {ActivityCategory} from '@domain/entities/ActivityCategory';
import {CategoryRow, ChildRow, UsageRow, VocabularyRow, ActivityRow, ActivityCategoryRow} from '@data/models/rows';

export const toCategory = (r: CategoryRow): Category =>
  new Category({
    id: r.id,
    nameVi: r.name_vi,
    nameEn: r.name_en,
    icon: r.icon,
    color: r.color,
    sortOrder: r.sort_order,
    isDefault: r.is_default === 1,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

export const toChild = (r: ChildRow): Child =>
  new Child({
    id: r.id,
    name: r.name,
    avatarPath: r.avatar_path,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

export const toVocabulary = (r: VocabularyRow): Vocabulary =>
  new Vocabulary({
    id: r.id,
    nameVi: r.name_vi,
    nameEn: r.name_en,
    imagePath: r.image_path,
    categoryId: r.category_id,
    speechTextVi: r.speech_text_vi,
    speechTextEn: r.speech_text_en,
    isDefault: r.is_default === 1,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

export const toActivity = (r: ActivityRow): Activity =>
  new Activity({
    id: r.id,
    nameVi: r.name_vi,
    nameEn: r.name_en,
    imagePath: r.image_path,
    categoryId: r.category_id,
    speechTextVi: r.speech_text_vi,
    speechTextEn: r.speech_text_en,
    isDefault: r.is_default === 1,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

export const toActivityCategory = (r: ActivityCategoryRow): ActivityCategory =>
  new ActivityCategory({
    id: r.id,
    nameVi: r.name_vi,
    nameEn: r.name_en,
    icon: r.icon,
    color: r.color,
    sortOrder: r.sort_order,
    isDefault: r.is_default === 1,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

export const toUsageRecord = (r: UsageRow): UsageRecord =>
  new UsageRecord({
    id: r.id,
    childId: r.child_id,
    vocabularyId: r.vocabulary_id,
    usedAt: r.used_at,
    context: r.context as UsageContext,
  });
