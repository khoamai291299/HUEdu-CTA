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
  getTts,
} from '@presentation/di/services';
import { VBEE_VOICES } from '@core/config/vbeeConfig';
import { translateText } from '@core/utils/translate';

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
  syncMissingImages: () => Promise<void>;
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
      // Fire and forget sync
      get().syncMissingImages().catch(() => {});
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
      return q.length === 0 || v.nameVi.toLowerCase().includes(q);
    });
  },

  addActivity: async input => {
    await new AddActivityUseCase(getActivityRepo()).execute(input);
    await get().load();
    if (!input.audioPath) {
      const text = input.speechTextVi || input.nameVi;
      if (text) {
        getTts().preload([text]).catch(() => {});
      }
    }
  },
  updateActivity: async (id, input) => {
    await new UpdateActivityUseCase(getActivityRepo()).execute({id, input});
    await get().load();
    if (!input.audioPath) {
      const text = input.speechTextVi || input.nameVi;
      if (text) {
        getTts().preload([text]).catch(() => {});
      }
    }
  },
  deleteActivity: async id => {
    await new DeleteActivityUseCase(getActivityRepo()).execute(id);
    await get().load();
  },

  syncMissingImages: async () => {
    const {activities} = get();
    let updated = false;

    // Danh sách 18 từ vựng đã được nhúng cứng (không bao giờ cần tải từ mạng)
    const PRELOADED = [
      'đi vệ sinh', 'đi ngủ', 'đi dạo', 'đi tắm', 'rửa tay', 'đánh răng', 'về nhà', 'đi học',
      'ăn cơm', 'uống nước', 'ăn bánh', 'uống sữa',
      'chơi đồ chơi', 'đọc sách', 'nghe nhạc', 'xem tivi', 'vẽ tranh', 'ôm mẹ'
    ];

    for (const act of activities) {
      if (PRELOADED.includes(act.nameVi.trim().toLowerCase())) {
        continue;
      }

      if (!act.imagePath || (act.imagePath.startsWith('lucide:') && act.imagePath !== 'lucide:Image-Failed')) {
        try {
          // Delay to prevent Google Translate and ARASAAC rate limiting
          await new Promise(resolve => setTimeout(resolve, 800));

          let searchWord = act.nameVi.toLowerCase();
          const englishWord = await translateText(searchWord, 'vi', 'en');
          if (englishWord) searchWord = englishWord.toLowerCase();
          
          const encoded = encodeURIComponent(searchWord);
          const res = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${encoded}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              const id = data[0]._id;
              const url = `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
              await new UpdateActivityUseCase(getActivityRepo()).execute({id: act.id, input: { imagePath: url }});
              updated = true;
            } else {
              // Not found
              await new UpdateActivityUseCase(getActivityRepo()).execute({id: act.id, input: { imagePath: 'lucide:Image-Failed' }});
              updated = true;
            }
          } else if (res.status === 404) {
            // Not found
            await new UpdateActivityUseCase(getActivityRepo()).execute({id: act.id, input: { imagePath: 'lucide:Image-Failed' }});
            updated = true;
          }
        } catch (e) {
          console.warn('Sync ARASAAC failed for', act.nameVi, e);
          // Don't infinite loop on network error
          await new UpdateActivityUseCase(getActivityRepo()).execute({id: act.id, input: { imagePath: 'lucide:Image-Failed' }});
          updated = true;
        }
      }
    }
    if (updated) {
      await get().load();
    }
  },

}));
