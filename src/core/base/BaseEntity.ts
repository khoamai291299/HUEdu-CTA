/**
 * src/core/base/BaseEntity.ts
 * Mục đích: Lớp thực thể nền tảng - mọi entity domain kế thừa (id + dấu thời gian).
 * OOP: Abstract class + inheritance + encapsulation.
 * Dependency: không.
 */
export abstract class BaseEntity {
  public readonly id: number;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  protected constructor(id: number, createdAt: number, updatedAt: number) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
