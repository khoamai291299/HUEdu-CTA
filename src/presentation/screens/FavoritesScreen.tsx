/**
 * src/presentation/screens/FavoritesScreen.tsx
 * Mục đích: Màn từ yêu thích của hồ sơ đang dùng - chạm để đọc, bỏ yêu thích (FR-06).
 * Dependency: stores (vocabulary/settings), useTts, useResponsiveGrid, components, i18n.
 */
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useResponsiveGrid} from '@presentation/hooks/useResponsiveGrid';
import {IconTile} from '@presentation/components/IconTile';
import {EmptyState} from '@presentation/components/EmptyState';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const FavoritesScreen: React.FC<MainTabScreenProps<'Favorites'>> = () => {
  const {t} = useTranslation();
  const {columns, tileSize, gap} = useResponsiveGrid();

  const vocabulary = useVocabularyStore(s => s.vocabulary);
  const favoriteIds = useVocabularyStore(s => s.favoriteIds);
  const toggleFavorite = useVocabularyStore(s => s.toggleFavorite);
  const categories = useVocabularyStore(s => s.categories);
  const language = useSettingsStore(s => s.settings.language);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const {speakWord} = useTts();

  useEffect(() => {
    if (activeChildId != null) {
      useVocabularyStore.getState().loadFavorites(activeChildId);
    }
  }, [activeChildId]);

  const data = vocabulary.filter(v => favoriteIds.has(v.id));

  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('favorites.title')} />
      </Appbar.Header>

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
            accentColor={categories.find(c => c.id === item.categoryId)?.color}
            isFavorite
            isDirectPlay
            onPress={speakWord}
            onToggleFavorite={
              activeChildId != null
                ? v => toggleFavorite(activeChildId, v.id)
                : undefined
            }
          />
        )}
        ListEmptyComponent={<EmptyState message={t('favorites.empty')} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  grid: {padding: 16},
});
