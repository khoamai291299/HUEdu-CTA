/**
 * src/data/repositories/PecsRepositoryImpl.ts
 * Mục đích: Hiện thực IPecsRepository trên SQLite (bảng pecs_interactions).
 * OOP: implements interface + constructor injection (DIP).
 * Dependency: IPecsRepository, IDatabaseService, PecsInteraction, rows.
 */
import {
  IPecsRepository,
  PecsInteractionInput,
} from '@domain/repositories/IPecsRepository';
import {IDatabaseService} from '@domain/services/IDatabaseService';
import {
  PecsInteraction,
  PecsInputKind,
} from '@domain/entities/PecsInteraction';
import {PecsInteractionRow} from '@data/models/rows';

export class PecsRepositoryImpl implements IPecsRepository {
  constructor(private readonly db: IDatabaseService) {}

  private toEntity(row: PecsInteractionRow): PecsInteraction {
    return new PecsInteraction({
      id: row.id,
      childId: row.child_id,
      cardId: row.card_id,
      occurredAt: row.occurred_at,
      responseMs: row.response_ms,
      isSuccess: row.is_success === 1,
      isIndependent: row.is_independent === 1,
      cancelCount: row.cancel_count,
      inputKind: row.input_kind as PecsInputKind,
    });
  }

  async record(input: PecsInteractionInput): Promise<void> {
    await this.db.executeSql(
      `INSERT INTO pecs_interactions
        (child_id, card_id, occurred_at, response_ms,
         is_success, is_independent, cancel_count, input_kind)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        input.childId,
        input.cardId,
        Date.now(),
        Math.max(0, Math.round(input.responseMs)),
        input.isSuccess ? 1 : 0,
        input.isIndependent ? 1 : 0,
        input.cancelCount,
        input.inputKind,
      ],
    );
  }

  async getRecent(childId: number, limit: number): Promise<PecsInteraction[]> {
    const res = await this.db.executeSql(
      `SELECT * FROM pecs_interactions
       WHERE child_id = ?
       ORDER BY occurred_at DESC, id DESC
       LIMIT ?;`,
      [childId, limit],
    );
    return res.rows.map(r => this.toEntity(r as unknown as PecsInteractionRow));
  }

  async clearForChild(childId: number): Promise<void> {
    await this.db.executeSql(
      'DELETE FROM pecs_interactions WHERE child_id = ?;',
      [childId],
    );
  }
}
