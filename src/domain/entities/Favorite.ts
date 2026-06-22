/**
 * src/domain/entities/Favorite.ts
 * Mục đích: Thực thể liên kết từ yêu thích giữa hồ sơ trẻ và từ vựng.
 * Dependency: không (id-based).
 */
export class Favorite {
  public readonly id: number;
  public readonly childId: number;
  public readonly vocabularyId: number;
  public readonly createdAt: number;

  constructor(params: {
    id: number;
    childId: number;
    vocabularyId: number;
    createdAt: number;
  }) {
    this.id = params.id;
    this.childId = params.childId;
    this.vocabularyId = params.vocabularyId;
    this.createdAt = params.createdAt;
  }
}
