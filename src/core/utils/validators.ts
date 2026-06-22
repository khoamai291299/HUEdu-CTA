/**
 * src/core/utils/validators.ts
 * Mục đích: Hàm kiểm tra dữ liệu thuần dùng cho form & nghiệp vụ.
 * Dependency: constants.
 */
import {Defaults} from '@core/constants';

export const isNonEmpty = (value: string | undefined | null): boolean =>
  !!value && value.trim().length > 0;

export const isValidPin = (pin: string): boolean =>
  new RegExp(`^\\d{${Defaults.PIN_LENGTH}}$`).test(pin);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
