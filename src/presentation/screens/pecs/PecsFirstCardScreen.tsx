/**
 * src/presentation/screens/pecs/PecsFirstCardScreen.tsx
 * Mục đích: Màn 7 — Chốt thẻ đầu tiên. Chỉ được chọn DUY NHẤT 1 thẻ trong 3 thẻ
 *           vừa pick (radio button logic) cho Bước 1.
 *           Đồng thời tải trước audio Vbee của thẻ để bé bấm là phát ngay.
 * Dependency: PecsPickTile, usePecsStore, useActivityStore, useTts.
 */
import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {PecsPickTile} from '@presentation/components/pecs/PecsPickTile';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useTts} from '@presentation/hooks/useTts';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {Activity} from '@domain/entities/Activity';

export const PecsFirstCardScreen: React.FC<
  PecsScreenProps<'PecsFirstCard'>
> = ({navigation}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const activities = useActivityStore(s => s.activities);
  const config = usePecsStore(s => s.config);
  const save = usePecsStore(s => s.save);
  const {speakWord, preloadWords, stop} = useTts();
  const username = useOnboardingStore(s => s.username);
  const childName = username.trim() || 'bé';

  const [selectedId, setSelectedId] = useState<number | null>(
    config.selectedCardId,
  );

  const rewardCards = useMemo(
    () =>
      config.rewardCardIds
        .map(id => activities.find(a => a.id === id))
        .filter((a): a is Activity => !!a),
    [config.rewardCardIds, activities],
  );

  // Tải trước audio Vbee cho cả 3 thẻ ứng viên -> bé chạm là nghe ngay, không chờ mạng.
  React.useEffect(() => {
    if (rewardCards.length > 0) {
      preloadWords(rewardCards);
    }
  }, [rewardCards, preloadWords]);

  const tileSize = Math.min(
    Math.floor((Math.min(width, 700) - 48 - 24) / 3),
    180,
  );

  const handlePick = (card: Activity) => {
    setSelectedId(card.id);
    // Phát thử để phụ huynh nghe đúng âm thanh bé sẽ nghe (không ghi lịch sử).
    speakWord(card, false);
  };

  const handleContinue = async () => {
    if (selectedId == null) {
      return;
    }
    stop();
    await save({selectedCardId: selectedId});
    navigation.navigate('PecsPinSetup');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={7} label="Chọn thẻ đầu tiên" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.question}>
          Chốt mục tiêu đầu tiên
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.hint, {color: theme.colors.onSurfaceVariant}]}>
          {`Trong số 3 món đồ trên, món nào ${childName} khao khát nhất LÚC NÀY? Đây sẽ là thẻ duy nhất xuất hiện trên màn hình để bé học cách giao tiếp đầu tiên.`}
        </Text>

        <View style={styles.row}>
          {rewardCards.map(card => (
            <PecsPickTile
              key={card.id}
              card={card}
              size={tileSize}
              mode="radio"
              selected={selectedId === card.id}
              onPress={handlePick}
            />
          ))}
        </View>

        {rewardCards.length === 0 ? (
          <Text style={{color: theme.colors.error, marginTop: 16}}>
            Chưa có thẻ nào được chọn ở bước trước. Ba mẹ hãy quay lại chọn 3
            thẻ giúp nhé.
          </Text>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        <Button
          mode="contained"
          disabled={selectedId == null}
          onPress={handleContinue}>
          Tiếp tục
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 24, paddingBottom: 24},
  question: {fontWeight: '800', marginTop: 12, marginBottom: 8},
  hint: {marginBottom: 28},
  row: {flexDirection: 'row', justifyContent: 'center', gap: 12},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
