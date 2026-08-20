/**
 * src/presentation/components/pecs/PecsCardGrid.tsx
 * Mục đích: Lưới thẻ mặc định (Default Library) chia theo danh mục — dùng chung cho
 *           Màn 6 (chọn 3 phần thưởng) và Dashboard Admin (chọn 1 thẻ).
 * Dependency: PecsPickTile, Activity, constants.
 */
import React, {useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Activity} from '@domain/entities/Activity';
import {PECS_CATEGORY_KEY} from '@core/constants';
import {PecsPickTile} from './PecsPickTile';

/** Thứ tự và nhãn hiển thị của các danh mục trong thư viện thẻ. */
const CATEGORY_ORDER: Array<{key: string; label: string; icon: string}> = [
  {key: 'food', label: 'Đồ ăn vặt & đồ uống', icon: '🍔'},
  {key: 'objects', label: 'Đồ chơi & đồ vật', icon: '🧸'},
  {key: 'personal', label: 'Hoạt động sinh hoạt', icon: '🪥'},
  {key: PECS_CATEGORY_KEY, label: 'Thẻ riêng của bé', icon: '📷'},
];

interface Props {
  cards: Activity[];
  selectedIds: number[];
  mode: 'radio' | 'check';
  /** Khoá các thẻ chưa chọn khi đã đạt giới hạn (dùng cho chọn tối đa 3 thẻ). */
  lockUnselected?: boolean;
  /**
   * true  -> chia theo danh mục (Dashboard Admin).
   * false -> một lưới phẳng, không tiêu đề nhóm (Bước 6 của luồng thiết lập).
   */
  grouped?: boolean;
  onToggle: (card: Activity) => void;
}

export const PecsCardGrid: React.FC<Props> = ({
  cards,
  selectedIds,
  mode,
  lockUnselected,
  grouped = true,
  onToggle,
}) => {
  const theme = useTheme();
  const {width} = useWindowDimensions();

  const columns = width >= 900 ? 5 : width >= 600 ? 4 : 3;
  const gap = 12;
  const horizontalPadding = 24;
  const tileSize = Math.floor(
    (Math.min(width, 1000) - horizontalPadding * 2 - gap * (columns - 1)) /
      columns,
  );

  const groups = useMemo(() => {
    if (!grouped) {
      return cards.length > 0
        ? [{key: '__all__', label: '', icon: '', items: cards}]
        : [];
    }
    return CATEGORY_ORDER.map(cat => ({
      ...cat,
      items: cards.filter(c => (c.categoryKey ?? '') === cat.key),
    })).filter(g => g.items.length > 0);
  }, [cards, grouped]);

  return (
    <View>
      {groups.map(group => (
        <View key={group.key} style={styles.group}>
          {group.label ? (
            <Text variant="titleMedium" style={styles.groupTitle}>
              {`${group.icon}  ${group.label}`}
            </Text>
          ) : null}
          <View style={[styles.grid, {gap}]}>
            {group.items.map(card => {
              const selected = selectedIds.includes(card.id);
              return (
                <PecsPickTile
                  key={card.id}
                  card={card}
                  size={tileSize}
                  mode={mode}
                  selected={selected}
                  disabled={!!lockUnselected && !selected}
                  onPress={onToggle}
                />
              );
            })}
          </View>
        </View>
      ))}

      {groups.length === 0 ? (
        <Text
          variant="bodyMedium"
          style={[styles.empty, {color: theme.colors.onSurfaceVariant}]}>
          Không tìm thấy thẻ nào phù hợp.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {marginBottom: 24},
  groupTitle: {fontWeight: '700', marginBottom: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  empty: {textAlign: 'center', paddingVertical: 24},
});
