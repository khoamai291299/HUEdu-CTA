import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { OnboardingScreenProps } from '@presentation/navigation/types';
import { useOnboardingStore } from '@presentation/stores/useOnboardingStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const DIAGNOSES = [
  { id: 'Autism', label: 'Tự kỷ (Autism)' },
  { id: 'Cerebral palsy', label: 'Bại não (Cerebral palsy)' },
  { id: 'Intellectual disability', label: 'Chậm phát triển trí tuệ' },
  { id: 'Speech delay', label: 'Chậm phát triển ngôn ngữ' },
  { id: 'Aphasia', label: 'Mất ngôn ngữ (Aphasia)' },
  { id: 'Down syndrome', label: 'Hội chứng Down' },
  { id: 'Hearing impairment', label: 'Khuyết tật thính giác' },
  { id: 'Other', label: 'Khác' },
];

export const DiagnosisScreen: React.FC<OnboardingScreenProps<'Diagnosis'>> = ({ navigation }) => {
  const theme = useTheme();
  const { diagnosis, setDiagnosis } = useOnboardingStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Chẩn đoán bệnh lý của trẻ ?</Text>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={{ gap: 12, paddingHorizontal: 24, paddingBottom: 40 }}>
          {DIAGNOSES.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.item,
                { backgroundColor: theme.colors.surfaceVariant },
                diagnosis === d.id && { borderWidth: 2, borderColor: theme.colors.primary }
              ]}
              onPress={() => setDiagnosis(d.id)}
            >
              <Text variant="titleMedium">{d.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()}>Quay lại</Button>
          <Button mode="contained" onPress={() => navigation.navigate('BirthYear')}>Tiếp tục</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center'},
  header: { paddingHorizontal: 24, paddingTop: 40 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 24 },
  list: { flex: 1 },
  item: { padding: 16, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
});
