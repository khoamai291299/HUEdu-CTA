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

export const BACKUP_FORMAT = {
  APP: 'HUEdu-CTA',
  VERSION: 1,
};
