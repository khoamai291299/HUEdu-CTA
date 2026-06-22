/**
 * src/presentation/screens/DirectCommonScreen.tsx
 * Mục đích: Tab hiển thị 20 từ vựng thông dụng nhất theo cơ chế phát trực tiếp (không ghép câu).
 */
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
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
  const {columns, tileSize, gap, paddingHorizontal} = useResponsiveGrid(16, 24);

  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const activities = useActivityStore(s => s.activities);
  const commonIds = useActivityStore(s => s.commonIds);
  const commonActivities = React.useMemo(() => {
    const actMap = new Map(activities.map(v => [v.id, v]));
    return commonIds.map(id => actMap.get(id)).filter(Boolean) as Vocabulary[];
  }, [activities, commonIds]);
  const loadCommon = useActivityStore(s => s.loadCommon);
  const language = useSettingsStore(s => s.settings.language);
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
        key={columns}
        data={commonActivities}
        keyExtractor={item => String(item.id)}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? {gap} : undefined}
        contentContainerStyle={[styles.grid, {gap, paddingHorizontal}]}
        renderItem={({item}) => (
          <IconTile
            vocabulary={item}
            size={tileSize}
            lang={language}
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
  grid: {padding: 16},
});
