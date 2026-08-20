/**
 * src/presentation/screens/pecs/PecsRewardPickScreen.tsx
 * Mục đích: Bước 6/9 "Chọn phần thưởng" — phụ huynh chọn đúng 3 món bé đang cực
 *           kỳ yêu thích, có ô tìm kiếm, và nút chụp ảnh món đồ THẬT của bé
 *           (trẻ tự kỷ thường gắn bó với đồ vật rất cụ thể).
 * Dependency: PecsCardGrid, PecsCreateCardModal, useActivityStore, usePecsStore.
 */
import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, Searchbar, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Camera} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {PagedGrid} from '@presentation/components/PagedGrid';
import {PecsPickTile} from '@presentation/components/pecs/PecsPickTile';
import {PecsCreateCardModal} from '@presentation/components/pecs/PecsCreateCardModal';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {Activity} from '@domain/entities/Activity';
import {Pecs} from '@core/constants';

/** Bỏ dấu tiếng Việt để tìm kiếm dễ khớp (giống bảng giao tiếp hiện có). */
const removeAccents = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

export const PecsRewardPickScreen: React.FC<
  PecsScreenProps<'PecsRewardPick'>
> = ({navigation}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const activities = useActivityStore(s => s.activities);
  const config = usePecsStore(s => s.config);
  const save = usePecsStore(s => s.save);
  const username = useOnboardingStore(s => s.username);
  const childName = username.trim() || 'bé';

  const [selected, setSelected] = useState<number[]>(config.rewardCardIds);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const max = Pecs.REWARD_CARD_COUNT;
  const isComplete = selected.length === max;

  // 3 cột × 3 hàng = 9 thẻ mỗi trang. Dùng Math.floor để bề rộng lưới luôn nhỏ
  // hơn bề rộng trang, tránh thẻ bị rớt dòng.
  const COLUMNS = 3;
  const ROWS = 3;
  const GAP = 12;
  const H_PADDING = 20;
  const tileSize = Math.floor(
    (Math.min(width, 640) - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS,
  );

  const filtered = useMemo(() => {
    const q = removeAccents(search.trim().toLowerCase());
    if (!q) {
      return activities;
    }
    return activities.filter(a =>
      removeAccents(a.nameVi.toLowerCase()).includes(q),
    );
  }, [activities, search]);

  const toggle = (card: Activity) => {
    setSelected(prev => {
      if (prev.includes(card.id)) {
        return prev.filter(id => id !== card.id);
      }
      if (prev.length >= max) {
        return prev;
      }
      return [...prev, card.id];
    });
  };

  const handleCreated = (cardId: number) => {
    // Thẻ vừa chụp được chọn ngay; nếu đã đủ 3 thì thay thẻ chọn đầu tiên.
    setSelected(prev =>
      prev.includes(cardId)
        ? prev
        : prev.length < max
        ? [...prev, cardId]
        : [...prev.slice(1), cardId],
    );
  };

  const handleContinue = async () => {
    await save({rewardCardIds: selected});
    navigation.navigate('PecsFirstCard');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={6} label="Chọn phần thưởng" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.heading}>
          Chọn phần thưởng yêu thích
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          {`Hãy chọn ra đúng 3 thẻ/món đồ ${childName} thích nhất hiện tại để làm phần thưởng khích lệ bé giao tiếp.`}
        </Text>

        <Text
          variant="titleMedium"
          style={[
            styles.counter,
            {color: isComplete ? theme.colors.primary : theme.colors.onSurface},
          ]}>
          {`Đã chọn: ${selected.length}/${max}`}
        </Text>

        <Searchbar
          placeholder="Tìm kiếm..."
          value={search}
          onChangeText={setSearch}
          style={[
            styles.search,
            {backgroundColor: theme.colors.surfaceVariant},
          ]}
        />
        </View>

        <PagedGrid
          items={filtered}
          columns={COLUMNS}
          rows={ROWS}
          tileSize={tileSize}
          gap={GAP}
          pageWidth={width}
          keyExtractor={card => String(card.id)}
          emptyComponent={
            <Text style={{color: theme.colors.onSurfaceVariant}}>
              Không tìm thấy thẻ nào phù hợp.
            </Text>
          }
          renderItem={card => (
            <PecsPickTile
              card={card}
              size={tileSize}
              mode="check"
              selected={selected.includes(card.id)}
              disabled={selected.length >= max && !selected.includes(card.id)}
              onPress={toggle}
            />
          )}
        />
      </ScrollView>

      {/* Banner dính đáy: chụp ảnh món đồ thật của bé */}
      <Pressable
        onPress={() => setShowCreate(true)}
        accessibilityRole="button"
        style={[
          styles.banner,
          {
            backgroundColor: theme.colors.secondaryContainer,
            borderColor: theme.colors.primary,
          },
        ]}>
        <Camera size={22} color={theme.colors.primary} />
        <Text variant="titleSmall" style={styles.bannerText}>
          + Chụp ảnh món đồ thực tế của bé
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        <Button mode="contained" disabled={!isComplete} onPress={handleContinue}>
          Tiếp tục
        </Button>
      </View>

      <PecsCreateCardModal
        visible={showCreate}
        onDismiss={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingBottom: 16},
  header: {paddingHorizontal: 20},
  heading: {fontWeight: '800', textAlign: 'center', marginTop: 8, marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 12},
  counter: {fontWeight: '700', textAlign: 'center', marginBottom: 12},
  search: {marginBottom: 20, borderRadius: 999},
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  bannerText: {fontWeight: '700', flexShrink: 1},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
  },
});
