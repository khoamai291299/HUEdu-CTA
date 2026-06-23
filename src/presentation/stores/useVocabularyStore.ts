/**
 * src/presentation/stores/useVocabularyStore.ts
 * Mục đích: Quản lý danh mục + từ vựng + lọc theo danh mục/tìm kiếm + yêu thích (FR-01,04,05,06).
 * Dependency: zustand, Vocabulary/Category use cases, FavoriteUseCases, services DI.
 */
import {create} from 'zustand';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {VocabularyInput} from '@domain/repositories/IVocabularyRepository';
import {
  AddVocabularyUseCase,
  DeleteVocabularyUseCase,
  GetAllVocabularyUseCase,
  UpdateVocabularyUseCase,
} from '@domain/usecases/vocabulary/VocabularyUseCases';
import {
  GetFavoritesUseCase,
  ToggleFavoriteUseCase,
} from '@domain/usecases/favorite/FavoriteUseCases';
import {
  getFavoriteRepo,
  getUsageRepo,
  getVocabularyRepo,
} from '@presentation/di/services';

interface VocabularyState {
  vocabulary: Vocabulary[];
  favoriteIds: Set<number>;
  commonIds: number[];
  search: string;
  loading: boolean;

  load: () => Promise<void>;
  loadFavorites: (childId: number) => Promise<void>;
  loadCommon: (childId: number) => Promise<void>;
  setSearch: (q: string) => void;
  visibleVocabulary: () => Vocabulary[];
  favoriteVocabulary: () => Vocabulary[];
  commonVocabulary: () => Vocabulary[];

  addVocabulary: (input: VocabularyInput) => Promise<void>;
  updateVocabulary: (
    id: number,
    input: Partial<VocabularyInput>,
  ) => Promise<void>;
  deleteVocabulary: (id: number) => Promise<void>;

  toggleFavorite: (childId: number, vocabularyId: number) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  vocabulary: [],
  favoriteIds: new Set<number>(),
  commonIds: [],
  search: '',
  loading: false,

  load: async () => {
    set({loading: true});
    try {
      const vocabulary = await new GetAllVocabularyUseCase(getVocabularyRepo()).execute();
      set({vocabulary});
    } finally {
      set({loading: false});
    }
  },

  loadFavorites: async childId => {
    const favs = await new GetFavoritesUseCase(getFavoriteRepo()).execute(
      childId,
    );
    set({favoriteIds: new Set(favs.map(v => v.id))});
  },

  loadCommon: async childId => {
    const mostUsed = await getUsageRepo().getMostUsed(childId, 10);
    set({commonIds: mostUsed.map(m => m.vocabularyId)});
  },


  setSearch: q => set({search: q}),

  visibleVocabulary: () => {
    const {vocabulary, search} = get();
    const q = search.trim().toLowerCase();
    return vocabulary.filter(v => {
      return q.length === 0 || v.nameVi.toLowerCase().includes(q);
    });
  },



  favoriteVocabulary: () => {
    const {vocabulary, favoriteIds} = get();
    return vocabulary.filter(v => favoriteIds.has(v.id));
  },

  commonVocabulary: () => {
    const {vocabulary, commonIds} = get();
    // Return in the order of commonIds
    const vocabMap = new Map(vocabulary.map(v => [v.id, v]));
    return commonIds.map(id => vocabMap.get(id)).filter(Boolean) as Vocabulary[];
  },

  addVocabulary: async input => {
    await new AddVocabularyUseCase(getVocabularyRepo()).execute(input);
    await get().load();
  },
  updateVocabulary: async (id, input) => {
    await new UpdateVocabularyUseCase(getVocabularyRepo()).execute({id, input});
    await get().load();
  },
  deleteVocabulary: async id => {
    await new DeleteVocabularyUseCase(getVocabularyRepo()).execute(id);
    await get().load();
  },



  toggleFavorite: async (childId, vocabularyId) => {
    const nowFav = await new ToggleFavoriteUseCase(getFavoriteRepo()).execute({
      childId,
      vocabularyId,
    });
    const next = new Set(get().favoriteIds);
    if (nowFav) {
      next.add(vocabularyId);
    } else {
      next.delete(vocabularyId);
    }
    set({favoriteIds: next});
  },
}));
