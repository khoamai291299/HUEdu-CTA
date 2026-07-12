/**
 * test-voices.mjs - Kiểm tra voice code nào hoạt động với Vbee API
 * Chạy: node test-voices.mjs
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const APP_ID = 'ee06aef7-494b-4acc-8cda-4dd5611acceb';
const ENDPOINT = 'https://vbee.vn/api/v1/tts';

const voicesToTest = [
  // Các voice code HIỆN TẠI (đang dùng trong app)
  { name: 'Ngọc Huyền [hiện tại]',  voiceCode: 'hn_female_ngochuyen_full_24k-st' },
  { name: 'Mạnh Dũng [hiện tại]',   voiceCode: 'hn_male_manhdung_full_24k-st' },
  // Các voice code THAY THẾ cần thử
  { name: 'Ngọc Huyền [alt 48k-fhg]',  voiceCode: 'hn_female_ngochuyen_full_48k-fhg' },
  { name: 'Mạnh Dũng [alt 48k-fhg]',   voiceCode: 'hn_male_manhdung_full_48k-fhg' },
  { name: 'Ngọc Huyền [alt newscast]',  voiceCode: 'hn_female_ngochuyen_newscast_24k-st' },
  { name: 'Mạnh Dũng [alt newscast]',   voiceCode: 'hn_male_manhdung_newscast_24k-st' },
  // Voice đang HOẠT ĐỘNG (làm baseline so sánh)
  { name: 'Ngân Hà [đang hoạt động]',  voiceCode: 'hn_female_nganha_child_22k-vc' },
  { name: 'Tường Vy [đang hoạt động]', voiceCode: 'sg_female_tuongvy_call_44k-fhg' },
  { name: 'Minh Quân [đang hoạt động]',voiceCode: 'hn_male_minhquan_yt-stable' },
];

async function testVoice(v) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: APP_ID,
        response_type: 'direct',
        input_text: 'Xin chào',
        voice_code: v.voiceCode,
        audio_type: 'mp3',
        speed_rate: '1.0',
        bitrate: 128,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    const body = await res.text();
    const preview = body.substring(0, 120).replace(/\n/g, ' ');

    let status = res.ok ? '✅ OK' : `❌ ${res.status}`;
    let detail = '';
    if (res.ok) {
      try {
        const json = JSON.parse(body);
        const hasAudio = !!(json.audio || json.result?.audio || json.audio_url || json.result?.audio_url);
        detail = hasAudio ? '→ Có audio data ✓' : `→ Không có audio: ${preview}`;
      } catch {
        detail = `→ Binary/non-JSON (${contentType}) len=${body.length}`;
      }
    } else {
      detail = `→ ${preview}`;
    }
    console.log(`${status}  ${v.name.padEnd(30)}  ${detail}`);
  } catch (e) {
    console.log(`❌ ERR  ${v.name.padEnd(30)}  → ${e.message}`);
  }
}

console.log('\n=== Kiểm tra Vbee Voice Codes ===\n');
for (const v of voicesToTest) {
  await testVoice(v);
}
console.log('\nXong!');
