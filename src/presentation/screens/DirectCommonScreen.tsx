/**
 * src/presentation/screens/DirectCommonScreen.tsx
 * Mục đích: Tab hiển thị 20 từ vựng thông dụng nhất theo cơ chế phát trực tiếp (không ghép câu).
 */
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View, useWindowDimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Appbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Settings as SettingsIcon} from 'lucide-react-native';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {useResponsiveGrid} from '@presentation/hooks/useResponsiveGrid';
import {IconTile} from '@presentation/components/IconTile';
import {EmptyState} from '@presentation/components/EmptyState';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {MainTabScreenProps} from '@presentation/navigation/types';

export const DirectCommonScreen: React.FC<MainTabScreenProps<'DirectCommon'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {columns, tileSize, gap, paddingHorizontal, itemsPerPage} = useResponsiveGrid(16, 24);

  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const activities = useActivityStore(s => s.activities);
  const commonIds = useActivityStore(s => s.commonIds);
  const commonActivities = React.useMemo(() => {
    const actMap = new Map(activities.map(v => [v.id, v]));
    return commonIds.map(id => actMap.get(id)).filter(Boolean) as Vocabulary[];
  }, [activities, commonIds]);
  const loadCommon = useActivityStore(s => s.loadCommon);

  const {width} = useWindowDimensions();

  const pages = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < commonActivities.length; i += itemsPerPage) {
      chunks.push(commonActivities.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [commonActivities, itemsPerPage]);

  const {speakWord} = useTts();

  useFocusEffect(
    useCallback(() => {
      if (activeChildId != null) {
        loadCommon(activeChildId);
      }
    }, [activeChildId, loadCommon]),
  );

  const onTilePress = (v: Vocabulary) => {
    speakWord(v);
  };



  return (
    <View style={[styles.container, {backgroundColor: 'transparent'}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content title={t('tabs.common')} />
        <Appbar.Action
          icon={() => <SettingsIcon size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.navigate('Settings' as any)}
        />
      </Appbar.Header>

      <FlatList
        data={pages}
        keyExtractor={(_, index) => String(index)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({item: page}) => (
          <View style={{width, paddingHorizontal, paddingTop: 4, paddingBottom: 24}}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap}}>
              {page.map((vocab) => (
                <IconTile
                  key={vocab.id}
                  vocabulary={vocab}
                  size={tileSize}
                  isDirectPlay={true}
                  onPress={onTilePress}
                />
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{width, alignItems: 'center', justifyContent: 'center', paddingTop: 40}}>
            <EmptyState message={t('common.empty')} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  grid: {padding: 16},
});
