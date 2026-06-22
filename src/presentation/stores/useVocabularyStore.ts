/**
 * src/presentation/stores/useVocabularyStore.ts
 * Mục đích: Quản lý danh mục + từ vựng + lọc theo danh mục/tìm kiếm + yêu thích (FR-01,04,05,06).
 * Dependency: zustand, Vocabulary/Category use cases, FavoriteUseCases, services DI.
 */
import {create} from 'zustand';
import {Category} from '@domain/entities/Category';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {CategoryInput} from '@domain/repositories/ICategoryRepository';
import {VocabularyInput} from '@domain/repositories/IVocabularyRepository';
import {
  AddCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@domain/usecases/category/CategoryUseCases';
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
  getCategoryRepo,
  getFavoriteRepo,
  getUsageRepo,
  getVocabularyRepo,
} from '@presentation/di/services';

interface VocabularyState {
  categories: Category[];
  vocabulary: Vocabulary[];
  favoriteIds: Set<number>;
  commonIds: number[];
  selectedCategoryIds: Set<number>;
  search: string;
  loading: boolean;

  load: () => Promise<void>;
  loadFavorites: (childId: number) => Promise<void>;
  loadCommon: (childId: number) => Promise<void>;
  toggleCategory: (id: number | null) => void;
  setSearch: (q: string) => void;
  visibleVocabulary: () => Vocabulary[];
  categoriesByType: () => Category[];
  favoriteVocabulary: () => Vocabulary[];
  commonVocabulary: () => Vocabulary[];

  addVocabulary: (input: VocabularyInput) => Promise<void>;
  updateVocabulary: (
    id: number,
    input: Partial<VocabularyInput>,
  ) => Promise<void>;
  deleteVocabulary: (id: number) => Promise<void>;

  addCategory: (input: CategoryInput) => Promise<void>;
  updateCategory: (id: number, input: Partial<CategoryInput>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  toggleFavorite: (childId: number, vocabularyId: number) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  categories: [],
  vocabulary: [],
  favoriteIds: new Set<number>(),
  commonIds: [],
  selectedCategoryIds: new Set(),
  search: '',
  loading: false,

  load: async () => {
    set({loading: true});
    try {
      const [categories, vocabulary] = await Promise.all([
        new GetCategoriesUseCase(getCategoryRepo()).execute(),
        new GetAllVocabularyUseCase(getVocabularyRepo()).execute(),
      ]);
      set({categories, vocabulary});
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

  toggleCategory: id => set(state => {
    if (id === null) return { selectedCategoryIds: new Set() };
    const next = new Set(state.selectedCategoryIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return { selectedCategoryIds: next };
  }),
  setSearch: q => set({search: q}),

  visibleVocabulary: () => {
    const {vocabulary, selectedCategoryIds, search} = get();
    const q = search.trim().toLowerCase();
    return vocabulary.filter(v => {
      const matchCat =
        selectedCategoryIds.size === 0 || selectedCategoryIds.has(v.categoryId);
      const matchSearch =
        q.length === 0 ||
        v.nameVi.toLowerCase().includes(q) ||
        (v.nameEn ?? '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  },

  categoriesByType: () => {
    return get().categories;
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

  addCategory: async input => {
    await new AddCategoryUseCase(getCategoryRepo()).execute(input);
    await get().load();
  },
  updateCategory: async (id, input) => {
    await new UpdateCategoryUseCase(getCategoryRepo()).execute({id, input});
    await get().load();
  },
  deleteCategory: async id => {
    await new DeleteCategoryUseCase(getCategoryRepo()).execute(id);
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
