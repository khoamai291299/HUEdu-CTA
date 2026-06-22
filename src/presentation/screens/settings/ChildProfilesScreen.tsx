/**
 * src/presentation/screens/settings/ChildProfilesScreen.tsx
 * Mục đích: Danh sách hồ sơ trẻ - chọn hồ sơ đang dùng, thêm/sửa/xoá (FR-10).
 * Dependency: useChildStore, useSettingsStore, react-native-paper, i18n.
 */
import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Appbar, Avatar, Badge, FAB, List, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {EmptyState} from '@presentation/components/EmptyState';
import {SettingsScreenProps} from '@presentation/navigation/types';

export const ChildProfilesScreen: React.FC<
  SettingsScreenProps<'ChildProfiles'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const children = useChildStore(s => s.children);
  const setActive = useChildStore(s => s.setActive);
  const remove = useChildStore(s => s.remove);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);

  const choose = async (id: number) => {
    await setActive(id);
    await useVocabularyStore.getState().loadFavorites(id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        keyExtractor={i => String(i.id)}
        renderItem={({item}) => (
          <List.Item
            title={item.name}
            description={item.id === activeChildId ? t('profiles.active') : undefined}
            onPress={() => choose(item.id)}
            left={() =>
              item.avatarPath ? (
                <Image source={{uri: item.avatarPath}} style={styles.avatar} />
              ) : (
                <Avatar.Text size={44} label={item.name.charAt(0)} style={styles.avatarText} />
              )
            }
            right={() => (
              <View style={styles.actions}>
                {item.id === activeChildId ? (
                  <Badge style={[styles.badge, {backgroundColor: theme.colors.primary}]}>
                    ✓
                  </Badge>
                ) : null}
                <Appbar.Action
                  icon="pencil"
                  onPress={() =>
                    navigation.navigate('ChildProfileEdit', {id: item.id})
                  }
                />
                <Appbar.Action
                  icon="delete"
                  disabled={children.length <= 1}
                  onPress={() => remove(item.id)}
                />
              </View>
            )}
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />
      <FAB
        icon="plus"
        label={t('profiles.addNew')}
        style={styles.fab}
        onPress={() => navigation.navigate('ChildProfileEdit', {})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  avatar: {width: 44, height: 44, borderRadius: 22, marginLeft: 12},
  avatarText: {marginLeft: 12},
  actions: {flexDirection: 'row', alignItems: 'center'},
  badge: {alignSelf: 'center', marginRight: 4},
  fab: {position: 'absolute', right: 16, bottom: 16},
});
