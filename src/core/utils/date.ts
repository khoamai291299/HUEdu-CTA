/**
 * src/core/utils/date.ts
 * Mục đích: Tiện ích thời gian thuần (không phụ thuộc thư viện ngoài) cho thống kê theo ngày.
 * Dependency: không.
 */

/** Trả về epoch milliseconds hiện tại. */
export const now = (): number => Date.now();

/** Chuyển epoch ms -> chuỗi ngày 'YYYY-MM-DD' theo giờ máy. */
export const toDateKey = (epochMs: number): string => {
  const d = new Date(epochMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Epoch ms tại 00:00:00 của 'n' ngày trước hôm nay. */
export const startOfDaysAgo = (n: number): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.getTime();
};
