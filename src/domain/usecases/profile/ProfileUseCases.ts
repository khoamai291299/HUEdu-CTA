/**
 * src/domain/usecases/profile/ProfileUseCases.ts
 * Mục đích: Use case quản lý hồ sơ trẻ (FR-10) + chọn hồ sơ đang dùng.
 * Dependency: BaseUseCase, IChildRepository, ISettingsRepository, Child, constants.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {ChildInput, IChildRepository} from '@domain/repositories/IChildRepository';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {Child} from '@domain/entities/Child';
import {DomainError} from '@core/errors/AppError';
import {isNonEmpty} from '@core/utils/validators';
import {SettingKey} from '@core/constants';

export class GetChildrenUseCase extends BaseUseCase<NoParams, Child[]> {
  constructor(private readonly repo: IChildRepository) {
    super();
  }
  execute(): Promise<Child[]> {
    return this.repo.getAll();
  }
}

export class AddChildUseCase extends BaseUseCase<ChildInput, Child> {
  constructor(private readonly repo: IChildRepository) {
    super();
  }
  execute(input: ChildInput): Promise<Child> {
    if (!isNonEmpty(input.name)) {
      throw new DomainError('VALIDATION', 'Tên hồ sơ không được rỗng');
    }
    return this.repo.create(input);
  }
}

export class UpdateChildUseCase extends BaseUseCase<
  {id: number; input: Partial<ChildInput>},
  Child
> {
  constructor(private readonly repo: IChildRepository) {
    super();
  }
  execute(params: {id: number; input: Partial<ChildInput>}): Promise<Child> {
    return this.repo.update(params.id, params.input);
  }
}

export class DeleteChildUseCase extends BaseUseCase<number, void> {
  constructor(private readonly repo: IChildRepository) {
    super();
  }
  execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}

export class SetActiveChildUseCase extends BaseUseCase<number, void> {
  constructor(private readonly settings: ISettingsRepository) {
    super();
  }
  execute(childId: number): Promise<void> {
    return this.settings.set(SettingKey.ACTIVE_CHILD_ID, String(childId));
  }
}
