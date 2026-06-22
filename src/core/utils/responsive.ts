/**
 * src/core/utils/responsive.ts
 * Mục đích: Tính số cột lưới biểu tượng theo chiều rộng màn hình (2/3/4/6 cột),
 *           phục vụ yêu cầu responsive cho 7"/8"/10"/12".
 * Dependency: constants.
 */
import {GridBreakpoints} from '@core/constants';

export const getColumnsForWidth = (width: number): number => {
  if (width < GridBreakpoints.PHONE_MAX) {
    return 2;
  }
  if (width < GridBreakpoints.TABLET_7_MAX) {
    return 3;
  }
  if (width < GridBreakpoints.TABLET_10_MAX) {
    return 4;
  }
  return 6;
};

export const isTablet = (width: number): boolean =>
  width >= GridBreakpoints.PHONE_MAX;
