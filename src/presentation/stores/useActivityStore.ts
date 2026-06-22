/**
 * src/presentation/stores/useActivityStore.ts
 * Mục đích: Quản lý danh mục + hoạt động (Giao tiếp chính).
 * Dependency: zustand, Activity/ActivityCategory use cases.
 */
import {create} from 'zustand';
import {ActivityCategory} from '@domain/entities/ActivityCategory';
import {Activity} from '@domain/entities/Activity';
import {ActivityCategoryInput} from '@domain/repositories/IActivityCategoryRepository';
import {ActivityInput} from '@domain/repositories/IActivityRepository';
import {
  AddActivityCategoryUseCase,
  DeleteActivityCategoryUseCase,
  GetActivityCategoriesUseCase,
  UpdateActivityCategoryUseCase,
} from '@domain/usecases/activity/ActivityCategoryUseCases';
import {
  AddActivityUseCase,
  DeleteActivityUseCase,
  GetAllActivityUseCase,
  UpdateActivityUseCase,
} from '@domain/usecases/activity/ActivityUseCases';
import {
  getActivityCategoryRepo,
  getActivityRepo,
  getUsageRepo,
} from '@presentation/di/services';

interface ActivityState {
  categories: ActivityCategory[];
  activities: Activity[];
  commonIds: number[];
  selectedCategoryIds: Set<number>;
  search: string;
  loading: boolean;

  load: () => Promise<void>;
  loadCommon: (childId: number) => Promise<void>;
  toggleCategory: (id: number | null) => void;
  setSearch: (q: string) => void;
  visibleActivities: () => Activity[];
  
  addActivity: (input: ActivityInput) => Promise<void>;
  updateActivity: (
    id: number,
    input: Partial<ActivityInput>,
  ) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;

  addCategory: (input: ActivityCategoryInput) => Promise<void>;
  updateCategory: (id: number, input: Partial<ActivityCategoryInput>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  categories: [],
  activities: [],
  commonIds: [],
  selectedCategoryIds: new Set(),
  search: '',
  loading: false,

  load: async () => {
    set({loading: true});
    try {
      const [categories, activities] = await Promise.all([
        new GetActivityCategoriesUseCase(getActivityCategoryRepo()).execute(),
        new GetAllActivityUseCase(getActivityRepo()).execute(),
      ]);
      set({categories, activities});
    } finally {
      set({loading: false});
    }
  },

  loadCommon: async childId => {
    const mostUsed = await getUsageRepo().getMostUsed(childId, 10, 'board_tap');
    set({commonIds: mostUsed.map(m => m.vocabularyId)});
  },

  toggleCategory: id => set(state => {
    if (id === null) return { selectedCategoryIds: new Set() };
    const next = new Set(state.selectedCategoryIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return { selectedCategoryIds: next };
  }),
  setSearch: q => set({search: q}),

  visibleActivities: () => {
    const {activities, selectedCategoryIds, search} = get();
    const q = search.trim().toLowerCase();
    return activities.filter(v => {
      const matchCat =
        selectedCategoryIds.size === 0 || selectedCategoryIds.has(v.categoryId);
      const matchSearch =
        q.length === 0 ||
        v.nameVi.toLowerCase().includes(q) ||
        (v.nameEn ?? '').toLowerCase().includes(q);
      return matchCat && matchSearch;
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

  addCategory: async input => {
    await new AddActivityCategoryUseCase(getActivityCategoryRepo()).execute(input);
    await get().load();
  },
  updateCategory: async (id, input) => {
    await new UpdateActivityCategoryUseCase(getActivityCategoryRepo()).execute({id, input});
    await get().load();
  },
  deleteCategory: async id => {
    await new DeleteActivityCategoryUseCase(getActivityCategoryRepo()).execute(id);
    await get().load();
  },
}));
