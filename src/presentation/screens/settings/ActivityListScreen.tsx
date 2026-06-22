import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Dialog,
  FAB,
  List,
  Portal,
  Button,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useActivityStore} from '@presentation/stores/useActivityStore';

import {EmptyState} from '@presentation/components/EmptyState';
import {SettingsScreenProps} from '@presentation/navigation/types';

export const ActivityListScreen: React.FC<
  SettingsScreenProps<'ActivityList'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const activityStore = useActivityStore();


  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<number | null>(null);

  const q = query.trim().toLowerCase();
  const data = activityStore.activities.filter(
    v =>
      q.length === 0 ||
      v.nameVi.toLowerCase().includes(q) ||
      (v.nameEn ?? '').toLowerCase().includes(q),
  );



  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('activity.searchPlaceholder')}
        value={query}
        onChangeText={setQuery}
        style={[styles.search, {backgroundColor: theme.colors.secondaryContainer}]}
      />
      <FlatList
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 80}}
        data={data}
        keyExtractor={i => String(i.id)}
        renderItem={({item}) => (
          <List.Item
            title={item.nameVi}
            description={`${item.nameEn ?? ''}`}
            left={() => <List.Icon icon="card-text-outline" />}
            right={() => (
              <View style={styles.actions}>
                <Appbar.Action
                  icon="pencil"
                  onPress={() =>
                    navigation.navigate('ActivityEdit', {id: item.id})
                  }
                />
                <Appbar.Action
                  icon="delete"
                  onPress={() => setToDelete(item.id)}
                />
              </View>
            )}
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />

      <FAB
        icon="plus"
        label={t('activity.add')}
        style={styles.fab}
        onPress={() => navigation.navigate('ActivityEdit', {})}
      />

      <Portal>
        <Dialog visible={toDelete != null} onDismiss={() => setToDelete(null)}>
          <Dialog.Title>{t('common.delete')}</Dialog.Title>
          <Dialog.Content>
            <Text>{t('vocabulary.deleteConfirm')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              onPress={async () => {
                if (toDelete != null) {
                  await activityStore.deleteActivity(toDelete);
                }
                setToDelete(null);
              }}>
              {t('common.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  search: {margin: 12},
  actions: {flexDirection: 'row'},
  fab: {position: 'absolute', right: 16, bottom: 16},
});
