/**
 * src/presentation/stores/usePecsStore.ts
 * Mục đích: Trạng thái toàn cục cho Bước 1 PECS — cấu hình thiết lập, thẻ đang chọn,
 *           kết quả đánh giá thành thạo; đồng thời là nơi ghi nhận lượt tương tác của trẻ.
 * Dependency: zustand, PecsUseCases, services DI, useSettingsStore.
 */
import {create} from 'zustand';
import {
  DEFAULT_PECS_CONFIG,
  PecsConfig,
  PecsMastery,
  inputKindFor,
} from '@domain/entities/PecsConfig';
import {PecsInputKind} from '@domain/entities/PecsInteraction';
import {
  EvaluatePecsMasteryUseCase,
  GetPecsConfigUseCase,
  RecordPecsInteractionUseCase,
  SavePecsConfigUseCase,
  isIndependentAttempt,
} from '@domain/usecases/pecs/PecsUseCases';
import {getPecsRepo, getSettingsRepo} from '@presentation/di/services';
import {useSettingsStore} from './useSettingsStore';
import {logger} from '@core/utils/logger';

const EMPTY_MASTERY: PecsMastery = {
  total: 0,
  windowSize: 20,
  successCount: 0,
  independentCount: 0,
  successRate: 0,
  independentRate: 0,
  isReadyForNextStage: false,
};

interface PecsState {
  config: PecsConfig;
  mastery: PecsMastery;
  loaded: boolean;

  /** Cách trẻ thao tác, suy ra từ mức vận động tinh (Decision Tree). */
  inputKind: () => PecsInputKind;

  load: () => Promise<void>;
  save: (patch: Partial<PecsConfig>) => Promise<void>;
  refreshMastery: () => Promise<void>;

  /** Ghi nhận 1 lượt tương tác của trẻ trong Child Mode. */
  recordAttempt: (params: {
    cardId: number;
    responseMs: number;
    isSuccess: boolean;
    cancelCount: number;
  }) => Promise<void>;

  /** Bật/tắt chế độ khoá máy cho trẻ. */
  setChildModeActive: (active: boolean) => Promise<void>;
}

export const usePecsStore = create<PecsState>((set, get) => ({
  config: DEFAULT_PECS_CONFIG,
  mastery: EMPTY_MASTERY,
  loaded: false,

  inputKind: () => inputKindFor(get().config.motorLevel),

  load: async () => {
    const config = await new GetPecsConfigUseCase(getSettingsRepo()).execute();
    set({config, loaded: true});
    await get().refreshMastery();
  },

  save: async patch => {
    await new SavePecsConfigUseCase(getSettingsRepo()).execute(patch);
    set({config: {...get().config, ...patch}});
  },

  refreshMastery: async () => {
    const childId = useSettingsStore.getState().settings.activeChildId;
    if (childId == null) {
      set({mastery: EMPTY_MASTERY});
      return;
    }
    try {
      const mastery = await new EvaluatePecsMasteryUseCase(
        getPecsRepo(),
      ).execute({childId});
      set({mastery});
    } catch (e) {
      logger.warn('[usePecsStore] refreshMastery failed', e);
    }
  },

  recordAttempt: async ({cardId, responseMs, isSuccess, cancelCount}) => {
    const childId = useSettingsStore.getState().settings.activeChildId;
    if (childId == null) {
      return;
    }
    try {
      await new RecordPecsInteractionUseCase(getPecsRepo()).execute({
        childId,
        cardId,
        responseMs,
        isSuccess,
        cancelCount,
        isIndependent: isIndependentAttempt({isSuccess, responseMs, cancelCount}),
        inputKind: get().inputKind(),
      });
      await get().refreshMastery();
    } catch (e) {
      logger.warn('[usePecsStore] recordAttempt failed', e);
    }
  },

  setChildModeActive: async active => {
    await get().save({childModeActive: active});
  },
}));
