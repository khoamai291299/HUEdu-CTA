/**
 * src/domain/usecases/pecs/PecsUseCases.ts
 * Mục đích: Nghiệp vụ Bước 1 PECS — đọc/ghi cấu hình thiết lập, ghi nhận từng lượt
 *           tương tác của trẻ và tính cờ isReadyForNextStage.
 * OOP: kế thừa BaseUseCase, dependency injection qua constructor.
 * Dependency: BaseUseCase, ISettingsRepository, IPecsRepository, PecsConfig, constants.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {
  IPecsRepository,
  PecsInteractionInput,
} from '@domain/repositories/IPecsRepository';
import {
  DEFAULT_PECS_CONFIG,
  PecsCommLevel,
  PecsConfig,
  PecsMastery,
  PecsMotorLevel,
} from '@domain/entities/PecsConfig';
import {PecsInteraction} from '@domain/entities/PecsInteraction';
import {Pecs, SettingKey} from '@core/constants';

// ─── Cấu hình ─────────────────────────────────────────────────────────────────

export class GetPecsConfigUseCase extends BaseUseCase<NoParams, PecsConfig> {
  constructor(private readonly repo: ISettingsRepository) {
    super();
  }

  async execute(): Promise<PecsConfig> {
    const all = await this.repo.getAll();

    const parseIds = (raw?: string): number[] => {
      if (!raw) {
        return [];
      }
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.map(Number).filter(n => Number.isFinite(n))
          : [];
      } catch {
        return [];
      }
    };

    const selectedRaw = all[SettingKey.PECS_SELECTED_CARD_ID];
    const selectedCardId =
      selectedRaw && Number.isFinite(Number(selectedRaw))
        ? Number(selectedRaw)
        : null;

    return {
      setupDone: all[SettingKey.PECS_SETUP_DONE] === 'true',
      commLevel:
        (all[SettingKey.PECS_COMM_LEVEL] as PecsCommLevel) ||
        DEFAULT_PECS_CONFIG.commLevel,
      motorLevel:
        (all[SettingKey.PECS_MOTOR_LEVEL] as PecsMotorLevel) ||
        DEFAULT_PECS_CONFIG.motorLevel,
      rewardCardIds: parseIds(all[SettingKey.PECS_REWARD_CARD_IDS]),
      selectedCardId,
      childModeActive: all[SettingKey.PECS_CHILD_MODE_ACTIVE] === 'true',
      masteryNotified: all[SettingKey.PECS_MASTERY_NOTIFIED] === 'true',
    };
  }
}

export class SavePecsConfigUseCase extends BaseUseCase<
  Partial<PecsConfig>,
  void
> {
  constructor(private readonly repo: ISettingsRepository) {
    super();
  }

  async execute(input: Partial<PecsConfig>): Promise<void> {
    if (input.setupDone !== undefined) {
      await this.repo.set(SettingKey.PECS_SETUP_DONE, String(input.setupDone));
    }
    if (input.commLevel !== undefined) {
      await this.repo.set(SettingKey.PECS_COMM_LEVEL, input.commLevel);
    }
    if (input.motorLevel !== undefined) {
      await this.repo.set(SettingKey.PECS_MOTOR_LEVEL, input.motorLevel);
    }
    if (input.rewardCardIds !== undefined) {
      await this.repo.set(
        SettingKey.PECS_REWARD_CARD_IDS,
        JSON.stringify(input.rewardCardIds),
      );
    }
    if (input.selectedCardId !== undefined) {
      if (input.selectedCardId === null) {
        await this.repo.remove(SettingKey.PECS_SELECTED_CARD_ID);
      } else {
        await this.repo.set(
          SettingKey.PECS_SELECTED_CARD_ID,
          String(input.selectedCardId),
        );
      }
    }
    if (input.childModeActive !== undefined) {
      await this.repo.set(
        SettingKey.PECS_CHILD_MODE_ACTIVE,
        String(input.childModeActive),
      );
    }
    if (input.masteryNotified !== undefined) {
      await this.repo.set(
        SettingKey.PECS_MASTERY_NOTIFIED,
        String(input.masteryNotified),
      );
    }
  }
}

// ─── Ghi nhận tương tác ───────────────────────────────────────────────────────

export class RecordPecsInteractionUseCase extends BaseUseCase<
  PecsInteractionInput,
  void
> {
  constructor(private readonly repo: IPecsRepository) {
    super();
  }

  execute(input: PecsInteractionInput): Promise<void> {
    return this.repo.record(input);
  }
}

// ─── Thuật toán nâng cấp level ────────────────────────────────────────────────

/**
 * Tính mức thành thạo từ một mảng lượt tương tác (thuần hàm — dễ kiểm thử).
 *
 * Quy tắc (theo tài liệu):
 *  - Xét tối đa `Pecs.WINDOW_SIZE` (20) lượt gần nhất.
 *  - Một lượt được tính "Độc lập" khi: thành công + phản hồi dưới
 *    `Pecs.INDEPENDENT_MAX_MS` (5 giây) + không hủy kéo giữa chừng.
 *  - Cờ isReadyForNextStage bật khi đã đủ 20 lượt VÀ tỷ lệ độc lập
 *    >= `Pecs.MASTERY_RATE` (80%).
 *
 * Lý do gate theo tỷ lệ ĐỘC LẬP (không phải chỉ "thành công"): tài liệu đưa ra
 * phép đo thời gian phản hồi & thao tác hủy kéo chính là để phân biệt trẻ tự làm
 * được với trẻ đang cần người lớn hỗ trợ. Cả hai tỷ lệ đều được trả về để
 * Dashboard hiển thị đầy đủ.
 */
export const computePecsMastery = (
  interactions: PecsInteraction[],
): PecsMastery => {
  const windowSize = Pecs.WINDOW_SIZE;
  const windowed = interactions.slice(0, windowSize);
  const total = windowed.length;
  const successCount = windowed.filter(i => i.isSuccess).length;
  const independentCount = windowed.filter(i => i.isIndependent).length;
  const successRate = total > 0 ? successCount / total : 0;
  const independentRate = total > 0 ? independentCount / total : 0;

  return {
    total,
    windowSize,
    successCount,
    independentCount,
    successRate,
    independentRate,
    isReadyForNextStage:
      total >= windowSize && independentRate >= Pecs.MASTERY_RATE,
  };
};

export class EvaluatePecsMasteryUseCase extends BaseUseCase<
  {childId: number},
  PecsMastery
> {
  constructor(private readonly repo: IPecsRepository) {
    super();
  }

  async execute(params: {childId: number}): Promise<PecsMastery> {
    const recent = await this.repo.getRecent(params.childId, Pecs.WINDOW_SIZE);
    return computePecsMastery(recent);
  }
}

/**
 * Xác định một lượt có phải "Độc lập" hay không — dùng chung cho Child Mode
 * và cho kiểm thử, tránh lặp lại điều kiện ở tầng UI.
 */
export const isIndependentAttempt = (params: {
  isSuccess: boolean;
  responseMs: number;
  cancelCount: number;
}): boolean =>
  params.isSuccess &&
  params.responseMs < Pecs.INDEPENDENT_MAX_MS &&
  params.cancelCount === 0;
