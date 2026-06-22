import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getTheme, AppThemeName} from '@core/theme';

const THEMES = [
  {id: 'light', color: '#FFFFFF'},
  {id: 'pale', color: '#D4E6F1'},
  {id: 'pink', color: '#FADBD8'},
  {id: 'green', color: '#D5F5E3'},
  {id: 'lavender', color: '#E8DAEF'},
  {id: 'peach', color: '#FAD7A1'},
  {id: 'mint', color: '#D1F2EB'},
  {id: 'sky', color: '#D6EAF8'},
  {id: 'lemon', color: '#FCF3CF'},
  {id: 'rose', color: '#F5B7B1'},
  {id: 'sand', color: '#EDBB99'},
];

export const ThemeColorScreen: React.FC<OnboardingScreenProps<'ThemeColor'>> = ({navigation}) => {
  const theme = useTheme();
  const {themeColor, setThemeColor} = useOnboardingStore();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Chọn màu giao diện</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Màu sắc nhẹ nhàng, ít tương phản mạnh giúp trẻ dễ tập trung hơn.
          </Text>
        </View>
        
        <ScrollView style={styles.list} contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 40}}>
          <View style={styles.grid}>
            {THEMES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.card,
                  {backgroundColor: t.color},
                  themeColor === t.id && {borderWidth: 4, borderColor: theme.colors.primary}
                ]}
                onPress={() => setThemeColor(t.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()}>Quay lại</Button>
          <Button mode="contained" onPress={() => navigation.navigate('Voice')}>Tiếp tục</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center'},
  header: {paddingHorizontal: 24, paddingTop: 40},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 16},
  subtitle: {textAlign: 'center', marginBottom: 40, opacity: 0.7},
  list: {flex: 1},
  grid: {flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 16},
  card: {width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#ccc'},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
