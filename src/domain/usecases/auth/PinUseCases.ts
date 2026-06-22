/**
 * src/domain/usecases/auth/PinUseCases.ts
 * Mục đích: Parent Gate - tạo/kiểm tra/kiểm tra-tồn-tại mã PIN (FR-09).
 *           PIN được băm + salt (xem rủi ro R12). UI không thấy PIN gốc.
 * Dependency: BaseUseCase, ISettingsRepository, hash util, validators, constants.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {generateSalt, hashPin} from '@core/utils/hash';
import {isValidPin} from '@core/utils/validators';
import {DomainError} from '@core/errors/AppError';
import {SettingKey} from '@core/constants';

export class SetPinUseCase extends BaseUseCase<string, void> {
  constructor(private readonly settings: ISettingsRepository) {
    super();
  }
  async execute(pin: string): Promise<void> {
    if (!isValidPin(pin)) {
      throw new DomainError('VALIDATION', 'PIN phải gồm 4 chữ số');
    }
    const salt = generateSalt();
    const hash = hashPin(pin, salt);
    await this.settings.set(SettingKey.PIN_SALT, salt);
    await this.settings.set(SettingKey.PIN_HASH, hash);
  }
}

export class VerifyPinUseCase extends BaseUseCase<string, boolean> {
  constructor(private readonly settings: ISettingsRepository) {
    super();
  }
  async execute(pin: string): Promise<boolean> {
    const salt = await this.settings.get(SettingKey.PIN_SALT);
    const hash = await this.settings.get(SettingKey.PIN_HASH);
    if (!salt || !hash) {
      return false;
    }
    return hashPin(pin, salt) === hash;
  }
}

export class IsPinSetUseCase extends BaseUseCase<NoParams, boolean> {
  constructor(private readonly settings: ISettingsRepository) {
    super();
  }
  async execute(): Promise<boolean> {
    const hash = await this.settings.get(SettingKey.PIN_HASH);
    return !!hash;
  }
}
