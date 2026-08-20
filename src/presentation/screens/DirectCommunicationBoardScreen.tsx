/**
 * src/presentation/screens/DirectCommunicationBoardScreen.tsx
 * Mục đích: Màn chính - bảng giao tiếp trực tiếp: chọn thẻ sẽ phát âm ngay lập tức.
 */
import React, {useState, useMemo, useRef} from 'react';
import {StyleSheet, View, useWindowDimensions, TouchableOpacity, Text} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon, Search as SearchIcon} from 'lucide-react-native';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useFocusEffect} from '@react-navigation/native';
import {useChildStore} from '@presentation/stores/useChildStore';
import {IconTile} from '@presentation/components/IconTile';
import {DraggableTile} from '@presentation/components/DraggableTile';
import {DropZone, DropZoneRef} from '@presentation/components/DropZone';
import {EmptyState} from '@presentation/components/EmptyState';
import {PagedGrid} from '@presentation/components/PagedGrid';
import {StickFigure} from '@presentation/components/StickFigure';
import {RecordAudioModal} from '@presentation/components/RecordAudioModal';
import {PinGateModal} from '@presentation/components/PinGateModal';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const DirectCommunicationBoardScreen: React.FC<
  MainTabScreenProps<'DirectBoard'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const setSearch = useActivityStore(s => s.setSearch);
  const search = useActivityStore(s => s.search);
  const activities = useActivityStore(s => s.activities);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const {speakWord, preloadWords} = useTts();

  const [showSearch, setShowSearch] = useState(false);
  const [dropZoneLayout, setDropZoneLayout] = useState<any>(null);
  const [droppedVocab, setDroppedVocab] = useState<Vocabulary | null>(null);
  const [settingsVocab, setSettingsVocab] = useState<Vocabulary | null>(null);
  const [showPinGate, setShowPinGate] = useState(false);
  const [activeTab, setActiveTab] = useState<'food' | 'personal' | 'objects'>('food');
  const dropZoneRef = useRef<DropZoneRef>(null);
  
  const updateActivity = useActivityStore(s => s.updateActivity);
  const loadActivities = useActivityStore(s => s.load);

  useFocusEffect(
    React.useCallback(() => {
      loadActivities();
      setActiveTab('food');
    }, [])
  );

  const data = useMemo(() => {
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };
    
    const q = removeAccents(search.toLowerCase());
    return activities.filter(v => {
      if (v.categoryKey !== activeTab) return false;
      
      const name = removeAccents(v.nameVi.toLowerCase());
      return q.length === 0 || name.includes(q);
    });
  }, [activities, search, activeTab]);

  React.useEffect(() => {
    preloadWords(data);
  }, [data, preloadWords]);

  const renderHeaderSearchIcon = React.useCallback(
    () => <SearchIcon size={28} color={theme.colors.onBackground} />,
    [theme.colors.onBackground]
  );

  const renderInputSearchIcon = React.useCallback(
    () => <SearchIcon size={24} color={theme.colors.onSurfaceVariant} />,
    [theme.colors.onSurfaceVariant]
  );

  const currentDroppedVocab = useMemo(() => {
    if (!droppedVocab) return null;
    return activities.find(v => v.id === droppedVocab.id) || droppedVocab;
  }, [droppedVocab, activities]);

  const {width} = useWindowDimensions();

  // Lưới 2 cột × 4 hàng = 8 thẻ mỗi trang. Kích thước ô suy ra từ vùng ĐO ĐƯỢC
  // (onLayout) chứ không từ hằng số ước lượng, nên không lệch giữa các máy.
  const [gridArea, setGridArea] = useState({width: 0, height: 0});
  // Bố cục 3 cột × 3 hàng nhưng chỉ 8 thẻ -> hàng cuối còn 2 thẻ (3-3-2) và ô
  // dưới cùng bên phải để trống cho nhân vật que.
  const GRID_COLUMNS = 3;
  const GRID_ROWS = 3;
  const GRID_ITEMS_PER_PAGE = 8;
  const GRID_GAP = 10;
  const GRID_H_PADDING = 12;
  /** Chỉ chừa chỗ cho hàng chấm trang — nhân vật que đã có ô trống thứ 9. */
  const GRID_BOTTOM_RESERVE = 34;

  const tileSize = useMemo(() => {
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
  };
  const skinToneId = child?.skinTone || 'tone2';
  const skinColor = TONE_COLORS[skinToneId] || TONE_COLORS.tone2;

  const onTilePress = (v: Vocabulary) => {
    // Không làm gì, theo yêu cầu mới
  };

  const onTileDrop = (v: Vocabulary) => {
    dropZoneRef.current?.triggerHighlight();
    setDroppedVocab(v); // Không phát âm, chỉ đưa vào DropZone
  };

  const handlePlayAudio = () => {
    if (currentDroppedVocab) speakWord(currentDroppedVocab);
  };

  const handleClearDropZone = () => {
    setDroppedVocab(null);
  };

  const onSettingsPress = (v: Vocabulary) => {
    setSettingsVocab(v);
  };

  const handleSaveAudio = async (vocabId: number, newAudioPath: string | null) => {
    await updateActivity(vocabId, { audioPath: newAudioPath });
  };

  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('tabs.directBoard')} titleStyle={{color: theme.colors.onBackground}} />
        <Appbar.Action
          icon={renderHeaderSearchIcon}
          color={theme.colors.onBackground}
          onPress={() => setShowSearch(s => !s)}
        />
        <Appbar.Action
          icon="cog"
          size={32}
          color={theme.colors.onBackground}
          onPress={() => setShowPinGate(true)}
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

      {/* Custom Category Tabs at the Top */}
      <View style={[styles.tabBarContainer, { backgroundColor: 'transparent' }]}>
        {(
          [
            { key: 'food', label: 'Ăn uống', icon: '🍔' },
            { key: 'personal', label: 'Sinh hoạt', icon: '🪥' },
            { key: 'objects', label: 'Đồ vật', icon: '🧸' },
          ] as const
        ).map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isActive && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }
              ]}
              onPress={() => {
                setActiveTab(tab.key);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabLabel,
                isActive ? { color: theme.colors.onPrimaryContainer, fontWeight: 'bold' } : { color: theme.colors.onBackground }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <DropZone
        ref={dropZoneRef}
        vocabulary={currentDroppedVocab}
        onPlay={handlePlayAudio}
        onClear={handleClearDropZone}
        onLayoutChange={setDropZoneLayout}
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

      {/* Nhân vật góc dưới */}
      <View style={[styles.avatarContainer, {backgroundColor: 'transparent', borderColor: 'transparent', elevation: 0}]}>
        <StickFigure faceColor={skinColor} pose="point" size={80} />
      </View>

      <RecordAudioModal
        visible={!!settingsVocab}
        vocabulary={settingsVocab}
        onDismiss={() => setSettingsVocab(null)}
        onSave={handleSaveAudio}
      />

      {/* AC1: Xác minh phụ huynh trước khi vào Settings */}
      <PinGateModal
        visible={showPinGate}
        onDismiss={() => setShowPinGate(false)}
        onSuccess={() => {
          setShowPinGate(false);
          navigation.navigate('Settings' as any);
        }}
        onMaxFailures={() => setShowPinGate(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gridArea: {flex: 1},
  searchbar: {marginHorizontal: 12, marginTop: 8},
  grid: {padding: 16},
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
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
