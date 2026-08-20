/**
 * src/presentation/components/PagedGrid.tsx
 * Mục đích: Lưới thẻ chia trang, vuốt ngang để sang trang, kèm chấm chỉ vị trí trang.
 *           Bề rộng mỗi trang và mỗi ô đều là số nguyên cố định nên thẻ KHÔNG BAO GIỜ
 *           bị rớt xuống dòng do sai số làm tròn (nguyên nhân khiến lưới 2 cột
 *           trước đây bị dồn thành 1 cột).
 *           Thứ tự xếp: trái sang phải, trên xuống dưới, không chừa ô trống.
 * Dependency: react-native, react-native-paper.
 */
import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';

interface Props<T> {
  items: T[];
  columns: number;
  rows: number;
  /**
   * Số thẻ mỗi trang. Mặc định = columns × rows.
   * Đặt nhỏ hơn để CHỪA Ô TRỐNG ở cuối lưới — ví dụ 3 cột × 3 hàng nhưng chỉ 8
   * thẻ thì ô dưới cùng bên phải bỏ trống cho nhân vật que đứng, không bị đè.
   */
  itemsPerPage?: number;
  /** Cạnh của mỗi ô (px, nên là số nguyên). */
  tileSize: number;
  gap: number;
  /** Bề rộng một trang — thường là bề rộng màn hình. */
  pageWidth: number;
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T) => React.ReactNode;
  /** Nội dung hiện khi không có thẻ nào. */
  emptyComponent?: React.ReactNode;
  /** Ẩn hàng chấm khi chỉ có 1 trang (mặc định: có hiện nếu > 1 trang). */
  showDots?: boolean;
}

export function PagedGrid<T>({
  items,
  columns,
  rows,
  itemsPerPage,
  tileSize,
  gap,
  pageWidth,
  keyExtractor,
  renderItem,
  emptyComponent,
  showDots = true,
}: Props<T>) {
  const theme = useTheme();
  const [page, setPage] = useState(0);

  const perPage = Math.max(itemsPerPage ?? columns * rows, 1);

  const pages = useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += perPage) {
      chunks.push(items.slice(i, i + perPage));
    }
    return chunks;
  }, [items, perPage]);

  // Bề rộng khối lưới tính chính xác theo số nguyên -> không bao giờ tràn.
  const gridWidth = tileSize * columns + gap * (columns - 1);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      setPage(Math.round(x / pageWidth));
    },
    [pageWidth],
  );

  // Giữ chỉ số trang hợp lệ khi danh sách co lại (vd: đang tìm kiếm).
  const activePage = Math.min(page, Math.max(pages.length - 1, 0));

  if (pages.length === 0) {
    return <View style={styles.empty}>{emptyComponent}</View>;
  }

  return (
    <View>
      <FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `page-${i}`}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({item: pageItems}) => (
          <View style={[styles.page, {width: pageWidth}]}>
            <View style={[styles.grid, {width: gridWidth, gap}]}>
              {/* Dùng Fragment chứ KHÔNG bọc thêm View: một View bọc quanh thẻ
                  sẽ cắt mất phần thẻ bay ra ngoài khi trẻ kéo thả trên Android.
                  Thẻ tự có width/height = tileSize nên flexWrap vẫn xếp đúng. */}
              {pageItems.map((item, index) => (
                <React.Fragment key={keyExtractor(item, index)}>
                  {renderItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      />

      {showDots && pages.length > 1 ? (
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activePage
                  ? {
                      backgroundColor: theme.colors.primary,
                      width: 22,
                    }
                  : {backgroundColor: theme.colors.outlineVariant},
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {alignItems: 'center'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start'},
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
  },
  dot: {width: 8, height: 8, borderRadius: 4},
  empty: {alignItems: 'center', justifyContent: 'center', paddingVertical: 32},
});
