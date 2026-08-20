/**
 * src/presentation/screens/DirectCommonScreen.tsx
 * Mục đích: Tab hiển thị 20 từ vựng thông dụng nhất theo cơ chế phát trực tiếp (không ghép câu).
 */
import React, {useCallback, useState, useRef} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Appbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon, Search as SearchIcon} from 'lucide-react-native';
import {Searchbar} from 'react-native-paper';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {IconTile} from '@presentation/components/IconTile';
import {DraggableTile} from '@presentation/components/DraggableTile';
import {DropZone, DropZoneRef} from '@presentation/components/DropZone';
import {EmptyState} from '@presentation/components/EmptyState';
import {PagedGrid} from '@presentation/components/PagedGrid';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const DirectCommonScreen: React.FC<MainTabScreenProps<'DirectCommon'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  // Lưới 2 cột × 4 hàng = 8 thẻ mỗi trang, suy ra từ vùng đo được (giống tab Giao tiếp).
  const [gridArea, setGridArea] = useState({width: 0, height: 0});
  // Bố cục 3 cột × 3 hàng nhưng chỉ 8 thẻ -> hàng cuối còn 2 thẻ (3-3-2) và ô
  // dưới cùng bên phải để trống cho nhân vật que.
  const GRID_COLUMNS = 3;
  const GRID_ROWS = 3;
  const GRID_ITEMS_PER_PAGE = 8;
  const GRID_GAP = 10;
  const GRID_H_PADDING = 12;
  const GRID_BOTTOM_RESERVE = 34;

  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const activities = useActivityStore(s => s.activities);
  const commonIds = useActivityStore(s => s.commonIds);
  const commonActivities = React.useMemo(() => {
    const actMap = new Map(activities.map(v => [v.id, v]));
    return commonIds.map(id => actMap.get(id)).filter(Boolean) as Vocabulary[];
  }, [activities, commonIds]);
  const loadCommon = useActivityStore(s => s.loadCommon);

  const [droppedVocabId, setDroppedVocabId] = useState<number | null>(null);

  const droppedVocab = React.useMemo(() => {
    if (droppedVocabId === null) return null;
    return commonActivities.find(v => v.id === droppedVocabId) || null;
  }, [droppedVocabId, commonActivities]);

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const data = React.useMemo(() => {
    const q = search.toLowerCase(); // Bỏ trim()
    return commonActivities.filter(v => {
      return q.length === 0 || v.nameVi.toLowerCase().includes(q);
    });
  }, [commonActivities, search]);

  const renderHeaderSearchIcon = React.useCallback(
    () => <SearchIcon size={28} color={theme.colors.onSurface} />,
    [theme.colors.onSurface]
  );

  const renderInputSearchIcon = React.useCallback(
    () => <SearchIcon size={24} color={theme.colors.onSurfaceVariant} />,
    [theme.colors.onSurfaceVariant]
  );

  const {width} = useWindowDimensions();

  const tileSize = React.useMemo(() => {
    if (gridArea.width === 0 || gridArea.height === 0) {
      return 0;
    }
    const fromWidth = Math.floor(
      (gridArea.width - GRID_H_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) /
        GRID_COLUMNS,
    );
    const fromHeight = Math.floor(
      (gridArea.height - GRID_BOTTOM_RESERVE - GRID_GAP * (GRID_ROWS - 1)) /
        GRID_ROWS,
    );
    return Math.max(Math.min(fromWidth, fromHeight), 84);
  }, [gridArea]);

  const {speakWord, preloadWords} = useTts();
  
  const [dropZoneLayout, setDropZoneLayout] = useState<any>(null);
  const dropZoneRef = useRef<DropZoneRef>(null);

  useFocusEffect(
    useCallback(() => {
      if (activeChildId != null) {
        loadCommon(activeChildId);
      }
    }, [activeChildId, loadCommon]),
  );

  React.useEffect(() => {
    preloadWords(commonActivities);
  }, [commonActivities, preloadWords]);

  const onTilePress = (v: Vocabulary) => {
    speakWord(v);
  };

  const onTileDrop = (v: Vocabulary) => {
    setDroppedVocabId(v.id);
    dropZoneRef.current?.triggerHighlight();
    // Không phát âm khi kéo thả — người dùng phải bấm nút loa mới đọc
    // speakWord(v);
  };

  const onPlayDropZone = () => {
    if (droppedVocab) {
      speakWord(droppedVocab);
    }
  };

  const onClearDropZone = () => {
    setDroppedVocabId(null);
  };

  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('tabs.common')} />
        <Appbar.Action
          icon={renderHeaderSearchIcon}
          onPress={() => setShowSearch(s => !s)}
        />
        <Appbar.Action
          icon="cog"
          size={32}
          onPress={() => navigation.navigate('Settings' as any)}
        />
      </Appbar.Header>

      {showSearch ? (
        <Searchbar
          placeholder={t('activity.searchPlaceholder')}
          value={search}
          onChangeText={setSearch}
          icon={renderInputSearchIcon}
          style={[styles.searchbar, {backgroundColor: theme.colors.secondaryContainer}]}
        />
      ) : null}

      <DropZone
        ref={dropZoneRef}
        onLayoutChange={setDropZoneLayout}
        onClear={onClearDropZone}
        onPlay={onPlayDropZone}
        vocabulary={droppedVocab}
      />

      <View
        style={styles.gridArea}
        onLayout={e => {
          const {width: w, height: h} = e.nativeEvent.layout;
          setGridArea({width: w, height: h});
        }}>
        {tileSize > 0 ? (
          <PagedGrid
            items={data}
            columns={GRID_COLUMNS}
            rows={GRID_ROWS}
            itemsPerPage={GRID_ITEMS_PER_PAGE}
            tileSize={tileSize}
            gap={GRID_GAP}
            pageWidth={width}
            keyExtractor={vocab => String(vocab.id)}
            emptyComponent={<EmptyState message={t('common.empty')} />}
            renderItem={vocab => (
              <DraggableTile
                vocabulary={vocab}
                size={tileSize}
                dropZoneLayout={dropZoneLayout}
                onDrop={onTileDrop}
                onPress={onTilePress}
              />
            )}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gridArea: {flex: 1},
  searchbar: {marginHorizontal: 12, marginTop: 8},
  grid: {padding: 16},
});
