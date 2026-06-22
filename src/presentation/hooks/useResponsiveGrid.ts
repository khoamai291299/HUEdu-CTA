import {useWindowDimensions} from 'react-native';

export const useResponsiveGrid = (gap = 12, horizontalPadding = 16) => {
  const {width} = useWindowDimensions();
  
  let columns = 3;
  if (width >= 1024) columns = 6;
  else if (width >= 768) columns = 5;
  else if (width >= 600) columns = 4;
  else columns = 3;
  
  // Calculate exact tile size considering all margins/gaps
  // We use a larger padding here to ensure cards are smaller
  const maxTileSize = width >= 600 ? 140 : 100;
  const available = width - horizontalPadding * 4 - gap * (columns - 1);
  const calculatedSize = Math.floor(available / columns) - 1;
  const tileSize = Math.min(maxTileSize, calculatedSize);
  
  const exactPadding = Math.max(horizontalPadding, (width - (tileSize * columns + gap * (columns - 1))) / 2);
  
  return {columns, tileSize, gap, paddingHorizontal: exactPadding};
};
