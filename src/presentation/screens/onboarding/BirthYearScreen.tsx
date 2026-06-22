import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';

export const BirthYearScreen: React.FC<OnboardingScreenProps<'BirthYear'>> = ({navigation}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const isTablet = width >= 600;
  const {birthYear, setBirthYear} = useOnboardingStore();

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 30}, (_, i) => currentYear - i);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Năm sinh của trẻ</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Lưu ý: Chỉ cần năm sinh, không thu thập ngày tháng để bảo vệ quyền riêng tư.
          </Text>
        </View>
        
        <ScrollView style={styles.list} contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 40}}>
          <View style={isTablet ? styles.grid : styles.columnGrid}>
            {years.map(y => (
              <TouchableOpacity
                key={y}
                style={[
                  styles.item,
                  {backgroundColor: theme.colors.surfaceVariant, width: isTablet ? 'auto' : '100%'},
                  birthYear === y && {borderWidth: 2, borderColor: theme.colors.primary}
                ]}
                onPress={() => setBirthYear(y)}
              >
                <Text variant="titleMedium" style={{textAlign: 'center'}}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()}>Quay lại</Button>
          <Button mode="contained" onPress={() => navigation.navigate('ThemeColor')}>Tiếp tục</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 500, alignSelf: 'center'},
  header: {paddingHorizontal: 24, paddingTop: 40},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 24, opacity: 0.7},
  list: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center'},
  columnGrid: {flexDirection: 'column', gap: 12},
  item: {paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', minWidth: 80},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
