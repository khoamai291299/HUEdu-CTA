/**
 * src/domain/repositories/IBaseRepository.ts
 * Mục đích: Hợp đồng CRUD chung cho mọi repository (Interface Segregation friendly).
 * Dependency: không.
 */
export interface IBaseRepository<TEntity> {
  getAll(): Promise<TEntity[]>;
  getById(id: number): Promise<TEntity | null>;
  delete(id: number): Promise<void>;
}
