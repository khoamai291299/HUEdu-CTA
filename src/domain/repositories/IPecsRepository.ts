/**
 * src/domain/repositories/IPecsRepository.ts
 * Mục đích: Hợp đồng ghi/đọc lượt tương tác PECS (bảng pecs_interactions).
 * Dependency: PecsInteraction.
 */
import {PecsInteraction, PecsInputKind} from '@domain/entities/PecsInteraction';

export interface PecsInteractionInput {
  childId: number;
  cardId: number;
  responseMs: number;
  isSuccess: boolean;
  isIndependent: boolean;
  cancelCount: number;
  inputKind: PecsInputKind;
}

export interface IPecsRepository {
  record(input: PecsInteractionInput): Promise<void>;
  /** N lượt gần nhất của một hồ sơ, mới nhất trước. */
  getRecent(childId: number, limit: number): Promise<PecsInteraction[]>;
  /** Xoá toàn bộ lượt của một hồ sơ (khi phụ huynh muốn học lại từ đầu). */
  clearForChild(childId: number): Promise<void>;
}
