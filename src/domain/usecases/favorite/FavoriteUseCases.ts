/**
 * src/domain/usecases/favorite/FavoriteUseCases.ts
 * Mục đích: Use case đánh dấu / bỏ đánh dấu & lấy danh sách từ yêu thích (FR-06).
 * Dependency: BaseUseCase, IFavoriteRepository, Vocabulary.
 */
import {BaseUseCase} from '@core/base/BaseUseCase';
import {IFavoriteRepository} from '@domain/repositories/IFavoriteRepository';
import {Vocabulary} from '@domain/entities/Vocabulary';

export class ToggleFavoriteUseCase extends BaseUseCase<
  {childId: number; vocabularyId: number},
  boolean
> {
  constructor(private readonly repo: IFavoriteRepository) {
    super();
  }
  /** Trả về trạng thái yêu thích MỚI sau thao tác. */
  async execute(params: {
    childId: number;
    vocabularyId: number;
  }): Promise<boolean> {
    const {childId, vocabularyId} = params;
    const isFav = await this.repo.isFavorite(childId, vocabularyId);
    if (isFav) {
      await this.repo.remove(childId, vocabularyId);
      return false;
    }
    await this.repo.add(childId, vocabularyId);
    return true;
  }
}

export class GetFavoritesUseCase extends BaseUseCase<number, Vocabulary[]> {
  constructor(private readonly repo: IFavoriteRepository) {
    super();
  }
  execute(childId: number): Promise<Vocabulary[]> {
    return this.repo.getFavoriteVocabulary(childId);
  }
}

export class IsFavoriteUseCase extends BaseUseCase<
  {childId: number; vocabularyId: number},
  boolean
> {
  constructor(private readonly repo: IFavoriteRepository) {
    super();
  }
  execute(params: {childId: number; vocabularyId: number}): Promise<boolean> {
    return this.repo.isFavorite(params.childId, params.vocabularyId);
  }
}
