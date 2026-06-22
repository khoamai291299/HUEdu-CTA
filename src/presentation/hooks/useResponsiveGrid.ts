import {useWindowDimensions} from 'react-native';

export const useResponsiveGrid = (gap = 12, horizontalPadding = 16) => {
  const {width} = useWindowDimensions();
  
  let columns = 3;
  if (width >= 1024) columns = 6;
  else if (width >= 768) columns = 5;
  else if (width >= 600) columns = 4;
  else columns = 3;
  
  // Calculate exact tile size considering all margins/gaps
  const available = width - horizontalPadding * 2 - gap * (columns - 1);
  const tileSize = Math.floor(available / columns) - 1;
  
  return {columns, tileSize, gap};
};
