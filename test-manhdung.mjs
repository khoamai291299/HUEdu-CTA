/**
 * test-manhdung.mjs - Tìm voice code đúng cho giọng Mạnh Dũng
 * Chạy: node test-manhdung.mjs
 */

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const APP_ID = 'ee06aef7-494b-4acc-8cda-4dd5611acceb';
const ENDPOINT = 'https://vbee.vn/api/v1/tts';

const voicesToTest = [
  'hn_male_manhdung_full_48k-fhg',
  'hn_male_manhdung_full_44k-fhg',
  'hn_male_manhdung_call_44k-fhg',
  'hn_male_manhdung_news_24k-fhg',
  'hn_male_manhdung_news_24k-st',
  'hn_male_manhdung_yt-stable',
  'hn_male_manhdung_22k-vc',
  'hn_male_manhdung_child_22k-vc',
  'manhdung',
  'male_manhdung',
  'hn_manhdung',
];

async function test(voiceCode) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: APP_ID, response_type: 'direct', input_text: 'Xin chào',
        voice_code: voiceCode, audio_type: 'mp3', speed_rate: '1.0', bitrate: 128,
      }),
    });
    const body = await res.text();
    const preview = body.substring(0, 150).replace(/\n/g, ' ');
    const hasLink = body.includes('audio_link') || body.includes('audio_url');
    const icon = hasLink ? '✅' : (body.includes('1001') ? '❌1001' : `⚠️`);
    console.log(`${icon}  ${voiceCode.padEnd(40)}  ${preview}`);
  } catch (e) {
    console.log(`❌  ${voiceCode.padEnd(40)}  ${e.message}`);
  }
}

console.log('\n=== Tìm voice code Mạnh Dũng ===\n');
for (const v of voicesToTest) {
  await test(v);
}
console.log('\nXong!');
