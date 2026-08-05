import {useWindowDimensions} from 'react-native';

export const useResponsiveGrid = (gap = 12, horizontalPadding = 16) => {
  const {width, height} = useWindowDimensions();

  const isLandscape = width > height;

  // Kích thước mong muốn tối thiểu cho mỗi thẻ (để đảm bảo chữ không bị chèn ép)
  const minTileWidth = isLandscape ? 150 : 130;
  const minTileHeight = isLandscape ? 140 : 120;

  // Tính số cột (trên điện thoại luôn là 2, trên tablet tối đa 6)
  let columns = isLandscape ? Math.floor((width - horizontalPadding * 2 + gap) / (minTileWidth + gap)) : 2;
  if (columns < 2) columns = 2;
  if (columns > 6) columns = 6;

  // Dành một khoảng không gian cho Header, DropZone, TabBar
  const verticalReserve = isLandscape ? 240 : 340;
  const availableHeight = height - verticalReserve;

  // Tính số dòng (trên điện thoại ép cứng 3 dòng, trên tablet ép cứng 3 dòng để thẻ luôn to và không bao giờ lẹm)
  let rows = 3;

  const itemsPerPage = columns * rows;

  // Calculate tile size to fit within the available space
  const availableWidth = width - horizontalPadding * 2 - gap * (columns - 1);
  const tileSizeFromWidth = Math.floor(availableWidth / columns);

  const tileSizeFromHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows);

  // Use the smaller of width/height-based sizes so nothing overflows
  const tileSize = Math.min(tileSizeFromWidth, tileSizeFromHeight);

  const exactPadding = Math.max(
    horizontalPadding,
    (width - (tileSize * columns + gap * (columns - 1))) / 2,
  );

  return {columns, rows, tileSize, gap, paddingHorizontal: exactPadding, itemsPerPage, isLandscape};
};
