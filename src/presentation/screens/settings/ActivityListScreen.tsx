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
import {useFocusEffect} from '@react-navigation/native';

import {EmptyState} from '@presentation/components/EmptyState';
import {SettingsScreenProps} from '@presentation/navigation/types';
import {ArasaacImage} from '@presentation/components/ArasaacImage';
import {Image} from 'react-native';

export const ActivityListScreen: React.FC<
  SettingsScreenProps<'ActivityList'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const activityStore = useActivityStore();

  useFocusEffect(
    React.useCallback(() => {
      activityStore.load();
    }, [])
  );


  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<number | null>(null);

  const q = query.trim().toLowerCase();
  const data = activityStore.activities.filter(
    v =>
      q.length === 0 ||
      v.nameVi.toLowerCase().includes(q),
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
            description={item.speechTextVi ?? ''}
            left={() => (
              <View style={{width: 40, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginLeft: 8, alignSelf: 'center'}}>
                {item.imagePath && !item.imagePath.startsWith('lucide:') ? (
                  <Image source={{uri: item.imagePath}} style={{width: 40, height: 40, resizeMode: 'cover'}} />
                ) : (
                  <ArasaacImage keyword={item.nameVi} size={40} />
                )}
              </View>
            )}
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
              onPress={() => {
                const id = toDelete;
                setToDelete(null);
                if (id != null) {
                  activityStore.deleteActivity(id).catch(console.error);
                }
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
