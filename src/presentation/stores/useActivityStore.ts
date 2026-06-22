/**
 * src/presentation/stores/useActivityStore.ts
 * Mục đích: Quản lý danh mục + hoạt động (Giao tiếp chính).
 * Dependency: zustand, Activity/ActivityCategory use cases.
 */
import {create} from 'zustand';
import {Activity} from '@domain/entities/Activity';
import {ActivityInput} from '@domain/repositories/IActivityRepository';
import {
  AddActivityUseCase,
  DeleteActivityUseCase,
  GetAllActivityUseCase,
  UpdateActivityUseCase,
} from '@domain/usecases/activity/ActivityUseCases';
import {
  getActivityRepo,
  getUsageRepo,
} from '@presentation/di/services';

interface ActivityState {
  activities: Activity[];
  commonIds: number[];
  search: string;
  loading: boolean;

  load: () => Promise<void>;
  loadCommon: (childId: number) => Promise<void>;
  setSearch: (q: string) => void;
  visibleActivities: () => Activity[];
  
  addActivity: (input: ActivityInput) => Promise<void>;
  updateActivity: (
    id: number,
    input: Partial<ActivityInput>,
  ) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  commonIds: [],
  search: '',
  loading: false,

  load: async () => {
    set({loading: true});
    try {
      const activities = await new GetAllActivityUseCase(getActivityRepo()).execute();
      set({activities});
    } finally {
      set({loading: false});
    }
  },

  loadCommon: async childId => {
    const mostUsed = await getUsageRepo().getMostUsed(childId, 10, 'board_tap');
    set({commonIds: mostUsed.map(m => m.vocabularyId)});
  },


  setSearch: q => set({search: q}),

  visibleActivities: () => {
    const {activities, search} = get();
    const q = search.trim().toLowerCase();
    return activities.filter(v => {
      const matchSearch =
        q.length === 0 ||
        v.nameVi.toLowerCase().includes(q) ||
        (v.nameEn ?? '').toLowerCase().includes(q);
      return matchSearch;
    });
  },

  addActivity: async input => {
    await new AddActivityUseCase(getActivityRepo()).execute(input);
    await get().load();
  },
  updateActivity: async (id, input) => {
    await new UpdateActivityUseCase(getActivityRepo()).execute({id, input});
    await get().load();
  },
  deleteActivity: async id => {
    await new DeleteActivityUseCase(getActivityRepo()).execute(id);
    await get().load();
  },


}));
