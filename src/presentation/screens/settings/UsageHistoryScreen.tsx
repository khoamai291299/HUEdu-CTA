/**
 * src/presentation/screens/settings/UsageHistoryScreen.tsx
 * Mục đích: Lịch sử sử dụng gần đây của hồ sơ đang dùng (FR-07).
 * Dependency: GetRecentUsageUseCase, services DI, useVocabularyStore, useSettingsStore, i18n.
 */
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {GetRecentUsageUseCase} from '@domain/usecases/usage/UsageUseCases';
import {getUsageRepo} from '@presentation/di/services';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {UsageRecord} from '@domain/entities/UsageRecord';
import {EmptyState} from '@presentation/components/EmptyState';

export const UsageHistoryScreen: React.FC = () => {
  const {t} = useTranslation();
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const vocabulary = useVocabularyStore(s => s.vocabulary);
  const activities = useActivityStore(s => s.activities);
  const [records, setRecords] = useState<UsageRecord[]>([]);

  useEffect(() => {
    if (activeChildId == null) {
      return;
    }
    new GetRecentUsageUseCase(getUsageRepo())
      .execute({childId: activeChildId, limit: 100})
      .then(setRecords);
  }, [activeChildId]);

  const nameOf = (item: UsageRecord) => {
    if (item.context === 'board_tap') {
      return activities.find(a => a.id === item.vocabularyId)?.nameVi ?? `#${item.vocabularyId}`;
    }
    return vocabulary.find(v => v.id === item.vocabularyId)?.nameVi ?? `#${item.vocabularyId}`;
  };

  const fmt = (ms: number) => new Date(ms).toLocaleString();

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 16}}
        data={records}
        keyExtractor={r => String(r.id)}
        renderItem={({item}) => (
          <List.Item
            title={nameOf(item)}
            description={`${fmt(item.usedAt)}`}
            left={() => <List.Icon icon="history" />}
          />
        )}
        ListEmptyComponent={<EmptyState message={t('common.empty')} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});
