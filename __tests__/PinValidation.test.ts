/**
 * __tests__/PinValidation.test.ts
 * Mục đích: Kiểm thử logic PIN (Parent Gate): validator, băm + salt, và use case
 *           Set/Verify/IsSet với ISettingsRepository giả lập trong bộ nhớ.
 */
import {isValidPin} from '@core/utils/validators';
import {hashPin, generateSalt, sha256} from '@core/utils/hash';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {
  IsPinSetUseCase,
  SetPinUseCase,
  VerifyPinUseCase,
} from '@domain/usecases/auth/PinUseCases';

class InMemorySettings implements ISettingsRepository {
  private store = new Map<string, string>();
  async get(key: string): Promise<string | null> {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
  async getAll(): Promise<Record<string, string>> {
    return Object.fromEntries(this.store);
  }
  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
}

describe('PIN validation & hashing', () => {
  it('isValidPin chỉ chấp nhận đúng 4 chữ số', () => {
    expect(isValidPin('1234')).toBe(true);
    expect(isValidPin('12')).toBe(false);
    expect(isValidPin('12a4')).toBe(false);
    expect(isValidPin('123456')).toBe(false);
  });

  it('sha256 cho kết quả đã biết (vector chuẩn)', () => {
    expect(sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('hashPin ổn định với cùng salt, khác nhau khi đổi PIN', () => {
    const salt = generateSalt();
    expect(hashPin('1234', salt)).toBe(hashPin('1234', salt));
    expect(hashPin('1234', salt)).not.toBe(hashPin('0000', salt));
  });
});

describe('PIN use cases', () => {
  it('Set rồi Verify đúng/sai, IsSet phản ánh trạng thái', async () => {
    const settings = new InMemorySettings();
    const setPin = new SetPinUseCase(settings);
    const verifyPin = new VerifyPinUseCase(settings);
    const isPinSet = new IsPinSetUseCase(settings);

    expect(await isPinSet.execute()).toBe(false);

    await setPin.execute('2468');

    expect(await isPinSet.execute()).toBe(true);
    expect(await verifyPin.execute('2468')).toBe(true);
    expect(await verifyPin.execute('0000')).toBe(false);
  });

  it('SetPin từ chối PIN không hợp lệ', async () => {
    const settings = new InMemorySettings();
    const setPin = new SetPinUseCase(settings);
    await expect(setPin.execute('12')).rejects.toThrow();
  });
});
