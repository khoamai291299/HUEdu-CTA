import React, {useState} from 'react';
import {Modal, View, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import {Searchbar, Button, Text, ActivityIndicator, Appbar, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (url: string) => void;
}

export const ArasaacPickerModal: React.FC<Props> = ({visible, onDismiss, onSelect}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      let res = await fetch(`https://api.arasaac.org/v1/pictograms/vi/search/${encodeURIComponent(keyword)}`);
      let data = await res.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        res = await fetch(`https://api.arasaac.org/v1/pictograms/en/search/${encodeURIComponent(keyword)}`);
        data = await res.json();
      }

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onDismiss} animationType="slide">
      <Appbar.Header>
        <Appbar.BackAction onPress={onDismiss} />
        <Appbar.Content title={t('activity.arasaacSearchTitle') || 'Tìm kiếm ARASAAC'} />
      </Appbar.Header>
      <View style={styles.container}>
        <Searchbar
          placeholder={t('activity.arasaacSearchPlaceholder') || 'Nhập từ khóa...'}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={search}
          style={styles.searchbar}
        />
        {loading ? (
          <ActivityIndicator style={{marginTop: 20}} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => String(item._id)}
            numColumns={3}
            contentContainerStyle={styles.list}
            renderItem={({item}) => {
              const url = `https://api.arasaac.org/v1/pictograms/${item._id}?download=false`;
              return (
                <TouchableOpacity
                  style={[styles.item, {backgroundColor: theme.colors.surfaceVariant}]}
                  onPress={() => onSelect(url)}>
                  <Image source={{uri: url}} style={styles.image} />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              keyword && !loading ? <Text style={styles.empty}>{t('activity.arasaacSearchEmpty') || 'Không tìm thấy'}</Text> : null
            }
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  searchbar: {margin: 16},
  list: {padding: 8},
  item: {flex: 1, margin: 8, aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 8},
  image: {width: '100%', height: '100%', resizeMode: 'contain'},
  empty: {textAlign: 'center', marginTop: 20, opacity: 0.6},
});
