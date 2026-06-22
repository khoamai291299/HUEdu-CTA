/**
 * src/domain/usecases/vocabulary/VocabularyUseCases.ts
 * Mục đích: Use case CRUD + tìm kiếm từ vựng (FR-05). Mỗi class một trách nhiệm (SRP).
 * Dependency: BaseUseCase, IVocabularyRepository, Vocabulary, DomainError, validators.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {
  IVocabularyRepository,
  VocabularyInput,
} from '@domain/repositories/IVocabularyRepository';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {DomainError} from '@core/errors/AppError';
import {isNonEmpty} from '@core/utils/validators';

export class GetAllVocabularyUseCase extends BaseUseCase<NoParams, Vocabulary[]> {
  constructor(private readonly repo: IVocabularyRepository) {
    super();
  }
  execute(): Promise<Vocabulary[]> {
    return this.repo.getAll();
  }
}


export class SearchVocabularyUseCase extends BaseUseCase<string, Vocabulary[]> {
  constructor(private readonly repo: IVocabularyRepository) {
    super();
  }
  execute(query: string): Promise<Vocabulary[]> {
    const q = query.trim();
    if (q.length === 0) {
      return this.repo.getAll();
    }
    return this.repo.search(q);
  }
}

export class AddVocabularyUseCase extends BaseUseCase<
  VocabularyInput,
  Vocabulary
> {
  constructor(private readonly repo: IVocabularyRepository) {
    super();
  }
  execute(input: VocabularyInput): Promise<Vocabulary> {
    if (!isNonEmpty(input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên tiếng Việt không được rỗng');
    }
    return this.repo.create(input);
  }
}

export class UpdateVocabularyUseCase extends BaseUseCase<
  {id: number; input: Partial<VocabularyInput>},
  Vocabulary
> {
  constructor(private readonly repo: IVocabularyRepository) {
    super();
  }
  execute(params: {
    id: number;
    input: Partial<VocabularyInput>;
  }): Promise<Vocabulary> {
    if (params.input.nameVi !== undefined && !isNonEmpty(params.input.nameVi)) {
      throw new DomainError('VALIDATION', 'Tên tiếng Việt không được rỗng');
    }
    return this.repo.update(params.id, params.input);
  }
}

export class DeleteVocabularyUseCase extends BaseUseCase<number, void> {
  constructor(private readonly repo: IVocabularyRepository) {
    super();
  }
  execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
