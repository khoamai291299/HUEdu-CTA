/**
 * src/presentation/screens/settings/VocabularyListScreen.tsx
 * Mục đích: Danh sách & tìm kiếm từ vựng, sửa/xoá, nút thêm mới (FR-05).
 * Dependency: useVocabularyStore, react-native-paper, i18n, SettingsScreenProps.
 */
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
} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';

import {EmptyState} from '@presentation/components/EmptyState';
import {PinGateModal} from '@presentation/components/PinGateModal';
import {SettingsScreenProps} from '@presentation/navigation/types';
import {ArasaacImage} from '@presentation/components/ArasaacImage';
import {Image} from 'react-native';
import {useTheme} from 'react-native-paper';

export const VocabularyListScreen: React.FC<
  SettingsScreenProps<'VocabularyList'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const vocabStore = useVocabularyStore();
  const theme = useTheme();


  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [showPinGate, setShowPinGate] = useState(false);

  const q = query.trim().toLowerCase();
  const data = vocabStore.vocabulary.filter(
    v =>
      q.length === 0 ||
      v.nameVi.toLowerCase().includes(q),
  );



  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('vocabulary.searchPlaceholder')}
        value={query}
        onChangeText={setQuery}
        style={styles.search}
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
              <View style={{width: 40, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginLeft: 8, alignSelf: 'center'}}>
                {(item.imagePath && !item.imagePath.startsWith('lucide:')) ? (
                  <Image source={{uri: item.imagePath}} style={{width: 40, height: 40, resizeMode: 'contain'}} />
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
                    navigation.navigate('VocabularyEdit', {id: item.id})
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

      <FAB.Group
        open={false}
        visible
        icon="plus"
        actions={[
          {
            icon: 'text-box-plus-outline',
            label: 'Thêm thẻ tùy chỉnh',
            onPress: () => setShowPinGate(true),
          },
          {
            icon: 'card-text-outline',
            label: 'Thêm từ vựng mới',
            onPress: () => navigation.navigate('VocabularyEdit', {}),
          },
        ]}
        onStateChange={() => {}}
        onPress={() => {
          if (!showPinGate) {
             // Handle by FAB.Group automatically
          }
        }}
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
                  await vocabStore.deleteVocabulary(toDelete);
                }
                setToDelete(null);
              }}>
              {t('common.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <PinGateModal
        visible={showPinGate}
        onDismiss={() => setShowPinGate(false)}
        onSuccess={() => {
          setShowPinGate(false);
          navigation.navigate('CreateCard' as any);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  search: {margin: 12},
  actions: {flexDirection: 'row'},
  fab: {position: 'absolute', right: 16, bottom: 16},
});
