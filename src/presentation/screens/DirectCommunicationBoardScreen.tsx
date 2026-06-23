/**
 * src/presentation/screens/DirectCommunicationBoardScreen.tsx
 * Mục đích: Màn chính - bảng giao tiếp trực tiếp: chọn thẻ sẽ phát âm ngay lập tức.
 */
import React, {useState, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon, Search as SearchIcon} from 'lucide-react-native';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useResponsiveGrid} from '@presentation/hooks/useResponsiveGrid';
import {useChildStore} from '@presentation/stores/useChildStore';
import {IconTile} from '@presentation/components/IconTile';
import {EmptyState} from '@presentation/components/EmptyState';
import {StickFigure} from '@presentation/components/StickFigure';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const DirectCommunicationBoardScreen: React.FC<
  MainTabScreenProps<'DirectBoard'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {columns, tileSize, gap, paddingHorizontal} = useResponsiveGrid(16, 24);

  const setSearch = useActivityStore(s => s.setSearch);
  const search = useActivityStore(s => s.search);
  const activities = useActivityStore(s => s.activities);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const {speakWord} = useTts();

  const [showSearch, setShowSearch] = useState(false);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter(v => {
      return q.length === 0 || v.nameVi.toLowerCase().includes(q);
    });
  }, [activities, search]);

  const TONE_COLORS: Record<string, string> = {
    tone0: '#FFFFFF',
    tone1: '#FFF5EE',
    tone2: '#FFDFC4',
    tone3: '#F7D5B8',
    tone4: '#F0D5BE',
    tone5: '#E8C4A0',
    tone6: '#DEB887',
    tone7: '#D2996C',
    tone8: '#C68642',
    tone9: '#B87333',
    tone10: '#AB724B',
    tone11: '#96613D',
    tone12: '#8D5524',
    tone13: '#7B4B2A',
    tone14: '#5C3A1E',
    tone15: '#4B3322',
  };
  const skinToneId = child?.skinTone || 'tone2';
  const skinColor = TONE_COLORS[skinToneId] || TONE_COLORS.tone2;

  const onTilePress = (v: Vocabulary) => {
    speakWord(v);
  };

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
          onPress={() => navigation.navigate('Settings' as any)}
        />
      </Appbar.Header>

      {showSearch ? (
        <Searchbar
          placeholder={t('activity.searchPlaceholder')}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchbar, {backgroundColor: theme.colors.secondaryContainer}]}
        />
      ) : null}


      <FlatList
        key={columns}
        data={data}
        keyExtractor={item => String(item.id)}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? {gap: gap} : undefined}
        contentContainerStyle={[styles.grid, {gap: gap, paddingHorizontal: paddingHorizontal}]}
        renderItem={({item}) => (
          <IconTile
            vocabulary={item}
            size={tileSize}
            isDirectPlay={true}
            onPress={onTilePress}
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />

      {/* Nhân vật góc dưới */}
      <View style={[styles.avatarContainer, {backgroundColor: 'transparent', borderColor: 'transparent', elevation: 0}]}>
        <StickFigure faceColor={skinColor} pose="point" size={80} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  searchbar: {marginHorizontal: 12, marginTop: 8},
  grid: {padding: 16},
  avatarContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    elevation: 4,
  },
});
