import {useWindowDimensions} from 'react-native';

export const useResponsiveGrid = (gap = 12, horizontalPadding = 16) => {
  const {width, height} = useWindowDimensions();

  const isLandscape = width > height;

  // Portrait: 3 cols × 4 rows = 12 tiles/page
  // Landscape: 5 cols × 2 rows = 10 tiles/page
  const columns = isLandscape ? 5 : 3;
  const rows = isLandscape ? 2 : 4;
  const itemsPerPage = columns * rows;

  // Calculate tile size to fit within the available space
  const availableWidth = width - horizontalPadding * 2 - gap * (columns - 1);
  const tileSizeFromWidth = Math.floor(availableWidth / columns);

  // Reserve vertical space for: status bar + AppBar header + tab bar + extra padding
  const verticalReserve = isLandscape ? 180 : 180;
  const availableHeight = height - verticalReserve;
  const tileSizeFromHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows);

  // Use the smaller of width/height-based sizes so nothing overflows
  const tileSize = Math.min(tileSizeFromWidth, tileSizeFromHeight);

  const exactPadding = Math.max(
    horizontalPadding,
    (width - (tileSize * columns + gap * (columns - 1))) / 2,
  );

  return {columns, rows, tileSize, gap, paddingHorizontal: exactPadding, itemsPerPage, isLandscape};
};
