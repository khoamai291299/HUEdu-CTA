/**
 * src/presentation/screens/DirectCommunicationBoardScreen.tsx
 * Mục đích: Màn chính - bảng giao tiếp trực tiếp: chọn thẻ sẽ phát âm ngay lập tức.
 */
import React, {useEffect, useState, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon, Search as SearchIcon} from 'lucide-react-native';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useResponsiveGrid} from '@presentation/hooks/useResponsiveGrid';
import {IconTile} from '@presentation/components/IconTile';
import {CategoryChips} from '@presentation/components/CategoryChips';
import {EmptyState} from '@presentation/components/EmptyState';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const DirectCommunicationBoardScreen: React.FC<
  MainTabScreenProps<'DirectBoard'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {columns, tileSize, gap} = useResponsiveGrid();

  const setSearch = useActivityStore(s => s.setSearch);
  const search = useActivityStore(s => s.search);
  const categories = useActivityStore(s => s.categories);
  const selectedCategoryIds = useActivityStore(s => s.selectedCategoryIds);
  const toggleCategory = useActivityStore(s => s.toggleCategory);
  const activities = useActivityStore(s => s.activities);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const language = useSettingsStore(s => s.settings.language);
  const {speakWord} = useTts();

  const [showSearch, setShowSearch] = useState(false);

  const data = useMemo(() => {
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
  }, [activities, selectedCategoryIds, search]);



  const onTilePress = (v: Vocabulary) => {
    speakWord(v);
  };

  const categoryColor = (v: Vocabulary): string | undefined =>
    categories.find(c => c.id === v.categoryId)?.color;

  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('tabs.directBoard')} />
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
            isDirectPlay={true}
            onPress={onTilePress}
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  searchbar: {marginHorizontal: 12, marginTop: 8},
  grid: {padding: 16},
});
