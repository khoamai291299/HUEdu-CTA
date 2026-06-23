/**
 * src/core/config/vbeeConfig.ts
 * Mục đích: Cấu hình Vbee TTS API — token, endpoint, danh sách giọng đọc.
 * LƯU Ý: Thay YOUR_ACCESS_TOKEN bằng token thật từ https://vbee.vn
 */

export const VBEE_CONFIG = {
  /** API endpoint */
  endpoint: 'https://api.vbee.vn/api/v1/tts',

  /** Access token — thay bằng token thật để kích hoạt Vbee TTS */
  accessToken: 'YOUR_ACCESS_TOKEN',

  /** Tốc độ đọc mặc định (1 = bình thường) */
  defaultSpeed: 1.0,

  /** Định dạng audio đầu ra */
  format: 'mp3' as const,

  /** Timeout cho mỗi request (ms) */
  timeout: 10000,
};

export interface VbeeVoice {
  id: string;
  voiceCode: string;
  label: string;
  desc: string;
  gender: 'male' | 'female';
  ageGroup: string;
}

/** Danh sách 6 giọng Vbee phổ biến */
export const VBEE_VOICES: VbeeVoice[] = [
  {
    id: 'ngochuyen',
    voiceCode: 'hn_female_ngochuyen_full_48k-fhg',
    label: 'Ngọc Huyền',
    desc: 'Nữ · Phổ thông',
    gender: 'female',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'minhquan',
    voiceCode: 'hn_male_minhquan_full_48k-fhg',
    label: 'Minh Quân',
    desc: 'Nam · Phổ thông',
    gender: 'male',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'nganha',
    voiceCode: 'hn_female_nganha_full_48k-fhg',
    label: 'Ngân Hà',
    desc: 'Nữ trẻ em · Nhẹ nhàng',
    gender: 'female',
    ageGroup: 'Trẻ em',
  },
  {
    id: 'vietbach',
    voiceCode: 'hn_male_vietbach_full_48k-fhg',
    label: 'Việt Bách',
    desc: 'Nam trẻ em · Vui vẻ',
    gender: 'male',
    ageGroup: 'Trẻ em',
  },
  {
    id: 'tuongvy',
    voiceCode: 'sg_female_tuongvy_full_48k-fhg',
    label: 'Tường Vy',
    desc: 'Nữ · Nhẹ nhàng',
    gender: 'female',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'manhdung',
    voiceCode: 'hn_male_manhdung_full_48k-fhg',
    label: 'Mạnh Dũng',
    desc: 'Nam · Thân thiện',
    gender: 'male',
    ageGroup: 'Người lớn',
  },
];
