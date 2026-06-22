/**
 * src/presentation/components/CategoryChips.tsx
 * Mục đích: Hàng chip chọn danh mục đa lựa chọn (Set) với chế độ mở rộng/thu gọn (FR-04).
 * Dependency: react-native, react-native-paper, LucideIcon, Category, i18n.
 */
import React, {useState, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Chip, IconButton, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Category} from '@domain/entities/Category';
import {LucideIcon} from './LucideIcon';

interface Props {
  categories: Category[];
  selectedIds: Set<number>;
  lang: 'vi' | 'en';
  onSelect: (id: number | null) => void;
}

export const CategoryChips: React.FC<Props> = ({
  categories,
  selectedIds,
  lang,
  onSelect,
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  const displayCategories = useMemo(() => {
    const selected = categories.filter(c => selectedIds.has(c.id));
    const unselected = categories.filter(c => !selectedIds.has(c.id));
    if (isExpanded) {
      return [...selected, ...unselected];
    }
    // Thu gọn: hiển thị các mục đang chọn và một số mục chưa chọn để người dùng dễ tiếp cận
    return [...selected, ...unselected.slice(0, Math.max(0, 3 - selected.length))];
  }, [categories, selectedIds, isExpanded]);

  const hasMore = categories.length > displayCategories.length || isExpanded;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        <Chip
          selected={selectedIds.size === 0}
          onPress={() => onSelect(null)}
          style={[styles.chip, selectedIds.size === 0 && {backgroundColor: theme.colors.primaryContainer}]}
          textStyle={selectedIds.size === 0 ? {color: theme.colors.onPrimaryContainer, fontWeight: 'bold'} : {}}>
          {t('board.allCategories')}
        </Chip>

        {displayCategories.map(c => {
          const isSelected = selectedIds.has(c.id);
          return (
            <Chip
              key={c.id}
              selected={isSelected}
              onPress={() => onSelect(c.id)}
              style={[
                styles.chip,
                isSelected ? {backgroundColor: c.color} : {borderColor: c.color, borderWidth: 1, backgroundColor: theme.colors.surface}
              ]}
              textStyle={isSelected ? {color: '#fff', fontWeight: 'bold'} : {color: theme.colors.onSurface}}
              icon={() => (
                <LucideIcon name={c.icon} size={18} color={isSelected ? '#fff' : theme.colors.onSurface} />
              )}>
              {lang === 'en' ? c.nameEn : c.nameVi}
            </Chip>
          );
        })}

        {hasMore && (
          <Chip
            onPress={() => setIsExpanded(!isExpanded)}
            style={[styles.chip, {backgroundColor: theme.colors.surfaceVariant, borderWidth: 0}]}
            textStyle={{color: theme.colors.onSurfaceVariant, fontWeight: 'bold'}}>
            {isExpanded ? '<<' : '>>'}
          </Chip>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
  },
  scrollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {borderRadius: 20},
});
