/**
 * src/core/constants/index.ts
 * Mục đích: Hằng số dùng chung toàn ứng dụng (tên DB, khoá settings, breakpoint responsive,
 *           ngưỡng touch target, giới hạn PIN...). Tập trung một nơi để dễ bảo trì.
 * Dependency: không.
 */

export const DB_NAME = 'huedu_cta.db';
export const DB_LOCATION = 'default';

/** Phiên bản schema hiện tại (đồng bộ với MigrationRunner). */
export const CURRENT_SCHEMA_VERSION = 1;

/** Khoá lưu trong bảng settings (nguồn chân lý cấu hình). */
export const SettingKey = {
  THEME: 'theme',
  LANGUAGE: 'language',
  SPEECH_RATE: 'speech_rate',
  SPEECH_PITCH: 'speech_pitch',
  VOICE_ID: 'voice_id',
  PIN_HASH: 'pin_hash',
  PIN_SALT: 'pin_salt',
  ACTIVE_CHILD_ID: 'active_child_id',
  SCHEMA_SEEDED: 'schema_seeded',
  IS_ONBOARDED: 'is_onboarded',
  CLONED_VOICES: 'cloned_voices',
  PARENT_PIN: 'parent_pin',
  CUSTOM_THEME_COLOR: 'custom_theme_color',

  // ── Bước 1 PECS ──
  PECS_SETUP_DONE: 'pecs_setup_done',
  PECS_COMM_LEVEL: 'pecs_comm_level',
  PECS_MOTOR_LEVEL: 'pecs_motor_level',
  PECS_REWARD_CARD_IDS: 'pecs_reward_card_ids',
  PECS_SELECTED_CARD_ID: 'pecs_selected_card_id',
  PECS_CHILD_MODE_ACTIVE: 'pecs_child_mode_active',
  PECS_MASTERY_NOTIFIED: 'pecs_mastery_notified',
} as const;

/** Khoá AsyncStorage (cache nhanh, không phải nguồn chân lý). */
export const StorageKey = {
  ONBOARDING_DONE: '@huedu/onboarding_done',
  CACHED_THEME: '@huedu/cached_theme',
} as const;

/** Giá trị mặc định cho cấu hình. */
export const Defaults = {
  THEME: 'pale' as const,
  LANGUAGE: 'vi' as const,
  SPEECH_RATE: 0.45,
  SPEECH_PITCH: 1.0,
  PIN_LENGTH: 4,
  MAX_PIN_ATTEMPTS: 5,
};

/** Breakpoint theo chiều rộng (dp) để xác định số cột lưới biểu tượng. */
export const GridBreakpoints = {
  PHONE_MAX: 480, // < 480: 2 cột
  TABLET_7_MAX: 720, // 480-720 (~7"): 3 cột
  TABLET_10_MAX: 1000, // 720-1000 (~8-10"): 4 cột
  // > 1000 (~12"): 6 cột
};

export const TouchTarget = {
  MIN: 64, // dp - vùng chạm tối thiểu cho trẻ
  ICON_TILE: 110,
};

/**
 * categoryKey riêng cho thẻ do phụ huynh tự tạo trong luồng PECS.
 * Dùng khoá riêng để các thẻ này KHÔNG lẫn vào 3 tab của bảng giao tiếp hiện có.
 */
export const PECS_CATEGORY_KEY = 'pecs';

/** Tham số nghiệp vụ Bước 1 PECS (theo tài liệu triển khai). */
export const Pecs = {
  /** Số lượt tương tác gần nhất dùng để đánh giá. */
  WINDOW_SIZE: 20,
  /** Ngưỡng tỷ lệ để bật cờ isReadyForNextStage. */
  MASTERY_RATE: 0.8,
  /** Dưới ngưỡng này (ms) mới được tính là thao tác "Độc lập". */
  INDEPENDENT_MAX_MS: 5000,
  /** Số thẻ "kho báu" phụ huynh chọn ở Màn 6. */
  REWARD_CARD_COUNT: 3,
  /** Tổng số bước của luồng thiết lập (dùng cho thanh tiến trình). */
  TOTAL_SETUP_STEPS: 9,
  /** Hệ số phóng to thẻ & vùng chạm khi trẻ ở mức vận động tinh 'basic'. */
  BASIC_HITBOX_SCALE: 1.6,
  /** Nới rộng biên Vùng nhận (px) để "hút thẻ" — trẻ không cần thả thật chính xác. */
  DROP_ZONE_PADDING: 48,
  /**
   * Một "lượt tương tác" kết thúc thất bại khi trẻ đã thao tác nhưng bỏ dở quá số lần
   * này, hoặc quá thời gian dưới đây. Chỉ tính khi trẻ ĐÃ chạm vào màn hình —
   * máy để không thì không ghi nhận gì, tránh làm nhiễu thống kê.
   */
  MAX_CANCELS_PER_ATTEMPT: 3,
  ATTEMPT_TIMEOUT_MS: 30000,
} as const;

export const BACKUP_FORMAT = {
  APP: 'HUEdu-CTA',
  VERSION: 1,
};
