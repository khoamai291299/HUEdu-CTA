import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';

const REGIONS = [
  {id: 'North', label: 'Miền Bắc'},
  {id: 'Central', label: 'Miền Trung'},
  {id: 'South', label: 'Miền Nam'},
];

export const RegionScreen: React.FC<OnboardingScreenProps<'Region'>> = ({navigation}) => {
  const theme = useTheme();
  const {region, setRegion} = useOnboardingStore();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text variant="headlineMedium" style={styles.title}>Chọn vùng miền</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Để ứng dụng gợi ý các từ ngữ phù hợp với văn hóa địa phương.
          </Text>
          
          <View style={styles.list}>
            {REGIONS.map(r => (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.item,
                  {backgroundColor: theme.colors.surfaceVariant},
                  region === r.id && {borderWidth: 2, borderColor: theme.colors.primary}
                ]}
                onPress={() => setRegion(r.id)}
              >
                <Text variant="titleMedium">{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()}>Quay lại</Button>
          <Button mode="contained" onPress={() => navigation.navigate('Diagnosis')}>Tiếp tục</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center'},
  scrollContent: {padding: 24, paddingBottom: 8},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 16},
  subtitle: {textAlign: 'center', marginBottom: 40, opacity: 0.7},
  list: {gap: 16},
  item: {padding: 24, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent'},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
