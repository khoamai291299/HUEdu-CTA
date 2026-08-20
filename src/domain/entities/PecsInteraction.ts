/**
 * src/domain/entities/PecsInteraction.ts
 * Mục đích: Thực thể một lượt tương tác của trẻ ở Bước 1 PECS (trao đổi 1 thẻ).
 *           Là dữ liệu đầu vào cho thuật toán tính cờ isReadyForNextStage.
 * Dependency: không (id-based, không kế thừa BaseEntity vì bản ghi bất biến, không có updatedAt).
 */

/** Cách trẻ thao tác với thẻ — do mức vận động tinh quyết định (Màn 5). */
export type PecsInputKind = 'tap' | 'drag';

export class PecsInteraction {
  public readonly id: number;
  public readonly childId: number;
  public readonly cardId: number;
  public readonly occurredAt: number;
  /** Thời gian từ lúc thẻ sẵn sàng đến lúc trẻ hoàn tất thao tác (ms). */
  public readonly responseMs: number;
  /** Trẻ đã trao đổi thẻ thành công (thả trúng Drop Zone / chạm đúng thẻ). */
  public readonly isSuccess: boolean;
  /** Thành công + dưới ngưỡng thời gian + không hủy kéo giữa chừng. */
  public readonly isIndependent: boolean;
  /** Số lần bắt đầu kéo rồi bỏ dở trong lượt này. */
  public readonly cancelCount: number;
  public readonly inputKind: PecsInputKind;

  constructor(params: {
    id: number;
    childId: number;
    cardId: number;
    occurredAt: number;
    responseMs: number;
    isSuccess: boolean;
    isIndependent: boolean;
    cancelCount: number;
    inputKind: PecsInputKind;
  }) {
    this.id = params.id;
    this.childId = params.childId;
    this.cardId = params.cardId;
    this.occurredAt = params.occurredAt;
    this.responseMs = params.responseMs;
    this.isSuccess = params.isSuccess;
    this.isIndependent = params.isIndependent;
    this.cancelCount = params.cancelCount;
    this.inputKind = params.inputKind;
  }
}
