/**
 * src/domain/entities/PecsConfig.ts
 * Mục đích: Kiểu dữ liệu cấu hình Bước 1 PECS (kết quả của luồng thiết lập dành cho
 *           phụ huynh) + kết quả đánh giá mức độ thành thạo.
 * Dependency: PecsInteraction (PecsInputKind).
 */
import {PecsInputKind} from './PecsInteraction';

/**
 * Màn 4 — Đánh giá giao tiếp.
 * 'stage1'   = Khóc/la hét/tự lấy, hoặc kéo tay ba mẹ (đáp án A, B).
 * 'advanced' = Đã biết đưa hình / chỉ tay chính xác (đáp án C).
 */
export type PecsCommLevel = 'stage1' | 'advanced';

/**
 * Màn 5 — Đánh giá vận động tinh.
 * 'basic'    = Chỉ chạm đập nhẹ, chưa biết vuốt (đáp án A) -> Hitbox lớn & hút thẻ mạnh.
 * 'standard' = Biết vuốt và kéo thả cơ bản (đáp án B)      -> Hitbox tiêu chuẩn.
 */
export type PecsMotorLevel = 'basic' | 'standard';

export interface PecsConfig {
  /** Đã chạy xong luồng thiết lập 5 bước chưa. */
  setupDone: boolean;
  commLevel: PecsCommLevel;
  motorLevel: PecsMotorLevel;
  /** 3 thẻ "kho báu" phụ huynh chọn ở Màn 6. */
  rewardCardIds: number[];
  /** Thẻ duy nhất hiển thị cho trẻ ở Bước 1 (Màn 7 / Dashboard). */
  selectedCardId: number | null;
  /** Đang khoá máy ở chế độ trẻ — mở app lại sẽ vào thẳng Child Mode. */
  childModeActive: boolean;
  /** Đã hiện popup chúc mừng thành thạo chưa (tránh lặp lại mỗi lần mở Dashboard). */
  masteryNotified: boolean;
}

export const DEFAULT_PECS_CONFIG: PecsConfig = {
  setupDone: false,
  commLevel: 'stage1',
  motorLevel: 'standard',
  rewardCardIds: [],
  selectedCardId: null,
  childModeActive: false,
  masteryNotified: false,
};

/**
 * Decision Tree (Bước 2 của tài liệu): mức vận động tinh quyết định UI hiển thị
 * cho trẻ ở Bước 5.
 *  - 'basic'    -> màn hình trống, CHỈ 1 thẻ, trẻ chạm (không có vùng kéo thả).
 *  - 'standard' -> 1 thẻ + 1 Vùng nhận (Drop Zone), trẻ kéo - thả.
 */
export const inputKindFor = (motorLevel: PecsMotorLevel): PecsInputKind =>
  motorLevel === 'basic' ? 'tap' : 'drag';

/** Kết quả đánh giá mức độ thành thạo trên cửa sổ N lượt gần nhất. */
export interface PecsMastery {
  /** Số lượt thực tế trong cửa sổ (<= windowSize). */
  total: number;
  windowSize: number;
  successCount: number;
  independentCount: number;
  /** successCount / total (0 nếu chưa có lượt nào). */
  successRate: number;
  /** independentCount / total (0 nếu chưa có lượt nào). */
  independentRate: number;
  /** Bật khi đủ cửa sổ và tỷ lệ độc lập >= ngưỡng. */
  isReadyForNextStage: boolean;
}
