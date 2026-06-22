/**
 * src/presentation/screens/settings/StatisticsDashboardScreen.tsx
 * Mục đích: Bảng thống kê - tổng lượt dùng, từ dùng nhiều nhất, biểu đồ cột theo ngày (FR-08).
 * Dependency: GetStatisticsUseCase, services DI, useSettingsStore, react-native-paper, i18n.
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, List, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {
  GetStatisticsUseCase,
  StatisticsResult,
} from '@domain/usecases/stats/GetStatisticsUseCase';
import {getUsageRepo} from '@presentation/di/services';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {EmptyState} from '@presentation/components/EmptyState';
import {LoadingView} from '@presentation/components/StatusView';

export const StatisticsDashboardScreen: React.FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const [stats, setStats] = useState<StatisticsResult | null>(null);

  useEffect(() => {
    if (activeChildId == null) {
      return;
    }
    new GetStatisticsUseCase(getUsageRepo())
      .execute({childId: activeChildId, days: 7, topN: 5})
      .then(setStats);
  }, [activeChildId]);

  if (activeChildId == null) {
    return <EmptyState message={t('common.empty')} />;
  }
  if (!stats) {
    return <LoadingView />;
  }

  const maxDaily = Math.max(1, ...stats.daily.map(d => d.count));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{t('stats.totalUsage')}</Text>
          <Text variant="displaySmall" style={{color: theme.colors.primary}}>
            {stats.totalCount}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={t('stats.byDay')} />
        <Card.Content>
          <View style={styles.chart}>
            {stats.daily.map(d => (
              <View key={d.dateKey} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(d.count / maxDaily) * 100}%`,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text variant="labelSmall">{d.dateKey.slice(5)}</Text>
                <Text variant="labelSmall">{d.count}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={t('stats.mostUsed')} />
        <Card.Content>
          {stats.mostUsed.length === 0 ? (
            <Text style={styles.muted}>{t('common.empty')}</Text>
          ) : (
            stats.mostUsed.map((m, idx) => (
              <List.Item
                key={m.vocabularyId}
                title={m.nameVi}
                left={() => <Text style={styles.rank}>{idx + 1}</Text>}
                right={() => (
                  <Text style={styles.count}>
                    {m.count} {t('stats.count')}
                  </Text>
                )}
              />
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 12},
  card: {marginBottom: 12},
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barCol: {flex: 1, alignItems: 'center'},
  barTrack: {height: 120, width: 18, justifyContent: 'flex-end'},
  bar: {width: 18, borderRadius: 6},
  muted: {opacity: 0.6},
  rank: {alignSelf: 'center', fontWeight: '700', width: 28, textAlign: 'center'},
  count: {alignSelf: 'center', opacity: 0.7},
});
