/**
 * src/presentation/stores/useChildStore.ts
 * Mục đích: Quản lý danh sách hồ sơ trẻ + thao tác CRUD + chọn hồ sơ đang dùng (FR-10).
 * Dependency: zustand, ProfileUseCases, services DI, useSettingsStore, Child.
 */
import {create} from 'zustand';
import {Child} from '@domain/entities/Child';
import {ChildInput} from '@domain/repositories/IChildRepository';
import {
  AddChildUseCase,
  DeleteChildUseCase,
  GetChildrenUseCase,
  SetActiveChildUseCase,
  UpdateChildUseCase,
} from '@domain/usecases/profile/ProfileUseCases';
import {getChildRepo, getSettingsRepo} from '@presentation/di/services';
import {useSettingsStore} from './useSettingsStore';

interface ChildState {
  children: Child[];
  loading: boolean;
  load: () => Promise<void>;
  add: (input: ChildInput) => Promise<void>;
  update: (id: number, input: Partial<ChildInput>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  setActive: (id: number) => Promise<void>;
  ensureActive: () => Promise<void>;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  loading: false,

  load: async () => {
    set({loading: true});
    try {
      const children = await new GetChildrenUseCase(getChildRepo()).execute();
      set({children});
    } finally {
      set({loading: false});
    }
  },

  add: async input => {
    await new AddChildUseCase(getChildRepo()).execute(input);
    await get().load();
  },

  update: async (id, input) => {
    await new UpdateChildUseCase(getChildRepo()).execute({id, input});
    await get().load();
  },

  remove: async id => {
    await new DeleteChildUseCase(getChildRepo()).execute(id);
    await get().load();
    if (useSettingsStore.getState().settings.activeChildId === id) {
      await get().ensureActive();
    }
  },

  setActive: async id => {
    await new SetActiveChildUseCase(getSettingsRepo()).execute(id);
    useSettingsStore.getState().setActiveChildId(id);
  },

  /** Đảm bảo luôn có một hồ sơ active (chọn hồ sơ đầu nếu chưa có/đã xoá). */
  ensureActive: async () => {
    const {children} = get();
    if (children.length === 0) {
      await get().load();
    }
    const list = get().children;
    const current = useSettingsStore.getState().settings.activeChildId;
    const stillValid = list.some(c => c.id === current);
    if (!stillValid && list.length > 0) {
      await get().setActive(list[0].id);
    }
  },
}));
