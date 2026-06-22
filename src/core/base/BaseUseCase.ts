/**
 * src/core/base/BaseUseCase.ts
 * Mục đích: Hợp đồng nền tảng cho mọi Use Case (Interactor) theo Clean Architecture.
 *           Một use case = một hành động nghiệp vụ, có execute(params): Promise<result>.
 * OOP: Abstract class + polymorphism (execute được override ở lớp con).
 * Dependency: không.
 */
export abstract class BaseUseCase<TParams, TResult> {
  abstract execute(params: TParams): Promise<TResult>;
}

/** Dùng cho use case không cần tham số đầu vào. */
export type NoParams = void;
