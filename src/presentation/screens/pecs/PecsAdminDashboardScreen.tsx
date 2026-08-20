/**
 * src/presentation/screens/pecs/PecsAdminDashboardScreen.tsx
 * Mục đích: Dashboard góc nhìn Admin (User Story 1) — hiển thị Default Library chia
 *           theo danh mục, chỉ cho chọn DUY NHẤT 1 thẻ (radio button logic), nút
 *           "Bắt đầu giao tiếp" chỉ sáng khi đã chọn thẻ; kèm bảng tiến độ của bé
 *           và pop-up gợi ý nâng cấp khi bé đã thành thạo.
 * Dependency: PecsCardGrid, PecsCreateCardModal, PecsMasteryDialog, usePecsStore.
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Button, Divider, Text, useTheme} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {Camera, Lock, RefreshCw} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsCardGrid} from '@presentation/components/pecs/PecsCardGrid';
import {PecsCreateCardModal} from '@presentation/components/pecs/PecsCreateCardModal';
import {PecsMasteryDialog} from '@presentation/components/pecs/PecsMasteryDialog';
import {PecsCardFace} from '@presentation/components/pecs/PecsCardFace';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useTts} from '@presentation/hooks/useTts';
import {Activity} from '@domain/entities/Activity';

export const PecsAdminDashboardScreen: React.FC<
  PecsScreenProps<'PecsDashboard'>
> = ({navigation}) => {
  const theme = useTheme();
  const config = usePecsStore(s => s.config);
  const mastery = usePecsStore(s => s.mastery);
  const save = usePecsStore(s => s.save);
  const refreshMastery = usePecsStore(s => s.refreshMastery);
  const activities = useActivityStore(s => s.activities);
  const loadActivities = useActivityStore(s => s.load);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const {preloadWords} = useTts();

  const [showCreate, setShowCreate] = useState(false);
  const [showMastery, setShowMastery] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
      refreshMastery();
    }, [loadActivities, refreshMastery]),
  );

  // Pop-up chúc mừng: chỉ hiện MỘT LẦN cho mỗi chu kỳ thành thạo.
  useEffect(() => {
    if (mastery.isReadyForNextStage && !config.masteryNotified) {
      setShowMastery(true);
    }
  }, [mastery.isReadyForNextStage, config.masteryNotified]);

  const selectedCard = useMemo(
    () => activities.find(a => a.id === config.selectedCardId) ?? null,
    [activities, config.selectedCardId],
  );

  // Tải trước audio cho thẻ đang chọn để bé chạm là nghe ngay (không chờ mạng).
  useEffect(() => {
    if (selectedCard) {
      preloadWords([selectedCard]);
    }
  }, [selectedCard, preloadWords]);

  const handleSelect = (card: Activity) => {
    // Radio logic: chạm lại thẻ đang chọn thì bỏ chọn, ngược lại thay thế thẻ cũ.
    save({selectedCardId: config.selectedCardId === card.id ? null : card.id});
  };

  const handleDismissMastery = async () => {
    setShowMastery(false);
    await save({masteryNotified: true});
  };

  const handleStartChildMode = async () => {
    await save({childModeActive: true});
    navigation.navigate('PecsChild');
  };

  const percent = Math.round(mastery.independentRate * 100);
  const successPercent = Math.round(mastery.successRate * 100);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="PECS · Bước 1 - Trao đổi thẻ" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Thẻ đang dùng ─────────────────────────────────────────────── */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Thẻ bé đang học
        </Text>
        <View
          style={[
            styles.currentCard,
            {backgroundColor: theme.colors.surfaceVariant},
          ]}>
          {selectedCard ? (
            <>
              <PecsCardFace card={selectedCard} size={110} showLabel={false} />
              <View style={styles.currentInfo}>
                <Text variant="headlineSmall" style={styles.currentName}>
                  {selectedCard.label()}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{color: theme.colors.onSurfaceVariant}}>
                  {config.motorLevel === 'basic'
                    ? 'Bé sẽ CHẠM vào thẻ (vùng chạm mở rộng)'
                    : 'Bé sẽ KÉO thẻ vào Vùng nhận'}
                </Text>
              </View>
            </>
          ) : (
            <Text
              variant="bodyMedium"
              style={{color: theme.colors.onSurfaceVariant}}>
              Chưa chọn thẻ. Ba mẹ hãy chọn 1 thẻ ở danh sách bên dưới.
            </Text>
          )}
        </View>

        {/* ── Tiến độ ───────────────────────────────────────────────────── */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Tiến độ của bé
        </Text>
        <View
          style={[
            styles.statsCard,
            {backgroundColor: theme.colors.secondaryContainer},
          ]}>
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Số lượt đã ghi nhận</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {`${mastery.total}/${mastery.windowSize}`}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Trao đổi thành công</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {`${mastery.successCount} (${successPercent}%)`}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Trao đổi độc lập (dưới 5 giây)</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {`${mastery.independentCount} (${percent}%)`}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <Text
            variant="bodySmall"
            style={{color: theme.colors.onSurfaceVariant}}>
            {mastery.isReadyForNextStage
              ? '🎉 Bé đã đạt mốc 80% trao đổi độc lập trên 20 lượt gần nhất.'
              : `Cần đạt 80% trao đổi độc lập trên ${mastery.windowSize} lượt gần nhất để mở gợi ý Bước 2.`}
          </Text>
        </View>

        {/* ── Thư viện thẻ ──────────────────────────────────────────────── */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Thư viện thẻ
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.libraryHint, {color: theme.colors.onSurfaceVariant}]}>
          Bước 1 chỉ dùng duy nhất 1 thẻ — chạm để chọn, chạm lần nữa để bỏ chọn.
        </Text>

        <Button
          mode="outlined"
          icon={() => <Camera size={20} color={theme.colors.primary} />}
          style={styles.actionBtn}
          onPress={() => setShowCreate(true)}>
          + Thêm thẻ mới (chụp ảnh món đồ thật)
        </Button>

        <PecsCardGrid
          cards={activities}
          selectedIds={config.selectedCardId ? [config.selectedCardId] : []}
          mode="radio"
          onToggle={handleSelect}
        />

        <Button
          mode="text"
          icon={() => (
            <RefreshCw size={18} color={theme.colors.onSurfaceVariant} />
          )}
          onPress={() => navigation.navigate('PecsChildName')}>
          Chạy lại toàn bộ thiết lập
        </Button>
      </ScrollView>

      {/* ── Nút bàn giao ────────────────────────────────────────────────── */}
      <View
        style={[styles.bottomBar, {borderTopColor: theme.colors.outlineVariant}]}>
        <Button
          mode="contained"
          disabled={!selectedCard}
          icon={() => (
            <Lock
              size={20}
              color={
                selectedCard ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled
              }
            />
          )}
          contentStyle={styles.startBtnContent}
          style={styles.startBtn}
          onPress={handleStartChildMode}>
          Bắt đầu giao tiếp (Khoá màn hình)
        </Button>
      </View>

      <PecsCreateCardModal
        visible={showCreate}
        onDismiss={() => setShowCreate(false)}
        onCreated={cardId => save({selectedCardId: cardId})}
      />

      <PecsMasteryDialog
        visible={showMastery}
        mastery={mastery}
        childName={child?.name}
        onDismiss={handleDismissMastery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingBottom: 32},
  sectionTitle: {fontWeight: '800', marginTop: 8, marginBottom: 10},
  currentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    marginBottom: 12,
  },
  currentInfo: {flex: 1},
  currentName: {fontWeight: '800', marginBottom: 4},
  statsCard: {borderRadius: 20, padding: 16, marginBottom: 12},
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  statValue: {fontWeight: '700'},
  divider: {marginVertical: 10},
  libraryHint: {marginBottom: 12},
  actionBtn: {borderRadius: 14, marginBottom: 20},
  bottomBar: {paddingHorizontal: 24, paddingVertical: 12, borderTopWidth: 1},
  startBtn: {borderRadius: 16},
  startBtnContent: {paddingVertical: 10},
});
