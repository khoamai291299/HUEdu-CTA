/**
 * src/core/di/Container.ts
 * Mục đích: DI Container tự xây gọn nhẹ (Service Locator) hỗ trợ đăng ký singleton
 *           dạng lazy factory và resolve theo token. Hiện thực Dependency Injection
 *           mà không cần thư viện ngoài.
 * OOP: Encapsulation (Map private), Singleton instance.
 * Dependency: Token, AppError.
 */
import {Token} from './tokens';
import {DomainError} from '@core/errors/AppError';

type Factory<T> = (c: Container) => T;

export class Container {
  private static _instance: Container | null = null;
  private readonly factories = new Map<Token, Factory<unknown>>();
  private readonly singletons = new Map<Token, unknown>();

  static get instance(): Container {
    if (!Container._instance) {
      Container._instance = new Container();
    }
    return Container._instance;
  }

  /** Chỉ dùng trong test để làm sạch container. */
  static reset(): void {
    Container._instance = null;
  }

  registerSingleton<T>(token: Token, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
  }

  resolve<T>(token: Token): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }
    const factory = this.factories.get(token);
    if (!factory) {
      throw new DomainError(
        'UNKNOWN',
        `DI: chưa đăng ký dịch vụ cho token ${String(token)}`,
      );
    }
    const instance = factory(this);
    this.singletons.set(token, instance);
    return instance as T;
  }

  has(token: Token): boolean {
    return this.factories.has(token);
  }
}
