/**
 * src/presentation/screens/CommunicationBoardScreen.tsx
 * Mục đích: Màn chính - bảng giao tiếp AAC: lưới biểu tượng theo danh mục, ghép câu,
 *           đọc to, yêu thích, tìm kiếm; nút mở Cài đặt (qua Parent Gate). (FR-01..07)
 * Dependency: stores (vocabulary/sentence/settings), useTts, useResponsiveGrid,
 *             components (IconTile, SentenceBar, CategoryChips, EmptyState), i18n.
 */
import React, {useEffect, useState, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon, Search as SearchIcon} from 'lucide-react-native';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useSentenceStore} from '@presentation/stores/useSentenceStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useResponsiveGrid} from '@presentation/hooks/useResponsiveGrid';
import {IconTile} from '@presentation/components/IconTile';
import {SentenceBar} from '@presentation/components/SentenceBar';
import {CategoryChips} from '@presentation/components/CategoryChips';
import {EmptyState} from '@presentation/components/EmptyState';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const CommunicationBoardScreen: React.FC<
  MainTabScreenProps<'Board'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {columns, tileSize, gap} = useResponsiveGrid();

  const allCategories = useVocabularyStore(s => s.categories);
  const selectedCategoryIds = useVocabularyStore(s => s.selectedCategoryIds);
  const toggleCategory = useVocabularyStore(s => s.toggleCategory);
  const favoriteIds = useVocabularyStore(s => s.favoriteIds);
  const setSearch = useVocabularyStore(s => s.setSearch);
  const search = useVocabularyStore(s => s.search);
  const toggleFavorite = useVocabularyStore(s => s.toggleFavorite);
  const allVocabulary = useVocabularyStore(s => s.vocabulary);

  const words = useSentenceStore(s => s.words);
  const addWord = useSentenceStore(s => s.add);
  const removeAt = useSentenceStore(s => s.removeAt);
  const removeLast = useSentenceStore(s => s.removeLast);
  const clear = useSentenceStore(s => s.clear);

  const language = useSettingsStore(s => s.settings.language);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const {speakWord, speakSentence} = useTts();

  const [showSearch, setShowSearch] = useState(false);

  // Tính danh sách hiển thị (lọc danh mục + tìm kiếm).
  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allVocabulary.filter(v => {
      const matchCat =
        selectedCategoryIds.size === 0 || selectedCategoryIds.has(v.categoryId);
      const matchSearch =
        q.length === 0 ||
        v.nameVi.toLowerCase().includes(q) ||
        (v.nameEn ?? '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allVocabulary, selectedCategoryIds, search]);

  const categories = allCategories;

  useEffect(() => {
    if (activeChildId != null) {
      useVocabularyStore.getState().loadFavorites(activeChildId);
    }
  }, [activeChildId]);

  const onTilePress = (v: Vocabulary) => {
    addWord(v);
    speakWord(v, false);
  };

  const categoryColor = (v: Vocabulary): string | undefined =>
    categories.find(c => c.id === v.categoryId)?.color;

  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('tabs.board')} />
        <Appbar.Action
          icon={() => <SearchIcon size={24} color={theme.colors.onSurface} />}
          onPress={() => setShowSearch(s => !s)}
        />
        <Appbar.Action
          icon={() => (
            <SettingsIcon size={24} color={theme.colors.onSurface} />
          )}
          onPress={() => navigation.navigate('ParentGate')}
        />
      </Appbar.Header>

      {showSearch ? (
        <Searchbar
          placeholder={t('vocabulary.searchPlaceholder')}
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
        />
      ) : null}

      <CategoryChips
        categories={categories}
        selectedIds={selectedCategoryIds}
        lang={language}
        onSelect={toggleCategory}
      />

      <FlatList
        key={columns}
        data={data}
        keyExtractor={item => String(item.id)}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? {gap} : undefined}
        contentContainerStyle={[styles.grid, {gap}]}
        renderItem={({item}) => (
          <IconTile
            vocabulary={item}
            size={tileSize}
            lang={language}
            accentColor={categoryColor(item)}
            isFavorite={favoriteIds.has(item.id)}
            isDirectPlay={true}
            onPress={onTilePress}
            onToggleFavorite={
              activeChildId != null
                ? v => toggleFavorite(activeChildId, v.id)
                : undefined
            }
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />

      <SentenceBar
        words={words}
        lang={language}
        onSpeak={() => speakSentence(words)}
        onRemoveLast={removeLast}
        onClear={clear}
        onRemoveAt={removeAt}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  searchbar: {marginHorizontal: 12, marginTop: 8},
  grid: {padding: 16},
});
