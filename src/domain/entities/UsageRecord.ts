/**
 * src/domain/entities/UsageRecord.ts
 * Mục đích: Thực thể bản ghi lịch sử sử dụng một từ (phục vụ thống kê).
 * Dependency: không.
 */
export type UsageContext = 'board_tap' | 'sentence_speak';

export class UsageRecord {
  public readonly id: number;
  public readonly childId: number;
  public readonly vocabularyId: number;
  public readonly usedAt: number;
  public readonly context: UsageContext;

  constructor(params: {
    id: number;
    childId: number;
    vocabularyId: number;
    usedAt: number;
    context: UsageContext;
  }) {
    this.id = params.id;
    this.childId = params.childId;
    this.vocabularyId = params.vocabularyId;
    this.usedAt = params.usedAt;
    this.context = params.context;
  }
}
