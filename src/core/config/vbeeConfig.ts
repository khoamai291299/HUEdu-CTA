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
  region: string;
  ageGroup: string;
}

/** Danh sách 6 giọng Vbee phổ biến */
export const VBEE_VOICES: VbeeVoice[] = [
  {
    id: 'ngochuyen',
    voiceCode: 'hn_female_ngochuyen_full_48k-fhg',
    label: 'Ngọc Huyền',
    desc: 'Nữ · Miền Bắc',
    gender: 'female',
    region: 'Miền Bắc',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'minhquan',
    voiceCode: 'hn_male_minhquan_full_48k-fhg',
    label: 'Minh Quân',
    desc: 'Nam · Miền Bắc',
    gender: 'male',
    region: 'Miền Bắc',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'nganha',
    voiceCode: 'hn_female_nganha_full_48k-fhg',
    label: 'Ngân Hà',
    desc: 'Nữ trẻ em · Miền Bắc',
    gender: 'female',
    region: 'Miền Bắc',
    ageGroup: 'Trẻ em',
  },
  {
    id: 'vietbach',
    voiceCode: 'hn_male_vietbach_full_48k-fhg',
    label: 'Việt Bách',
    desc: 'Nam trẻ em · Miền Bắc',
    gender: 'male',
    region: 'Miền Bắc',
    ageGroup: 'Trẻ em',
  },
  {
    id: 'tuongvy',
    voiceCode: 'sg_female_tuongvy_full_48k-fhg',
    label: 'Tường Vy',
    desc: 'Nữ · Miền Nam',
    gender: 'female',
    region: 'Miền Nam',
    ageGroup: 'Thanh niên',
  },
  {
    id: 'manhdung',
    voiceCode: 'hn_male_manhdung_full_48k-fhg',
    label: 'Mạnh Dũng',
    desc: 'Nam · Miền Bắc',
    gender: 'male',
    region: 'Miền Bắc',
    ageGroup: 'Người lớn',
  },
];
