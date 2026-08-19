const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const VBEE_APP_ID = process.env.VBEE_APP_ID;
const VBEE_ACCESS_TOKEN = process.env.VBEE_ACCESS_TOKEN;
const ENDPOINT = 'https://vbee.vn/api/v1/tts';
const DEFAULT_SPEED = 1.0;

const VBEE_VOICES = [
  'hn_female_ngochuyen_full_48k-fhg',
  'hn_male_manhdung_news_48k-phg',
  'hn_female_nganha_child_22k-vc',
  'hn_male_vietbach_child_22k-vc',
  'sg_female_tuongvy_call_44k-fhg',
  'hn_male_minhquan_yt-stable'
];

const WORDS = [
  'Con muốn ăn cơm', 'Con muốn ăn thịt gà', 'Con muốn ăn trứng chiên', 'Con muốn ăn canh', 'Con muốn uống nước', 'Con muốn uống sữa', 'Con muốn uống nước cam', 'Con muốn ăn sữa chua', 'Con muốn ăn táo', 'Con muốn ăn chuối', 'Con muốn ăn cam', 'Con muốn ăn dưa hấu',
  'Con muốn ăn', 'Con muốn uống', 'Con muốn đi ngủ', 'Con muốn đi vệ sinh', 'Con muốn đi rửa tay', 'Con muốn đi đánh răng', 'Con muốn đi tắm', 'Con muốn mặc áo thun', 'Con muốn mặc quần dài',
  'Con muốn chơi xe đồ chơi', 'Con muốn chơi quả bóng', 'Con muốn chơi với gấu bông', 'Con muốn chơi búp bê', 'Con muốn xếp khối gỗ', 'Con muốn đọc sách', 'Con muốn dùng bút chì', 'Con muốn viết vào vở', 'Con muốn dùng cục tẩy',
  'Bé'
];

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function cleanText(str) {
  return str.replace(/^[\s.]+/, '').trim();
}

function getCacheKey(text, voiceCode) {
  return String(simpleHash(voiceCode + cleanText(text)));
}

async function downloadAudio(url, dest) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(dest, buffer);
}

async function fetchFromVbee(text, voiceCode) {
  const requestBody = {
    app_id: VBEE_APP_ID,
    response_type: 'direct',
    input_text: cleanText(text),
    voice_code: voiceCode,
    audio_type: 'mp3',
    speed_rate: String(DEFAULT_SPEED),
    bitrate: 128,
  };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VBEE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const rawText = await response.text();
  if (!response.ok) throw new Error(`Vbee API error: ${response.status} - ${rawText}`);

  const data = JSON.parse(rawText);
  const audioUrl = data.audio_url || data.result?.audio_url || data.result?.audio_link || data.audio_link || data.data?.audio_link;
  const audioBase64 = data.audio || data.result?.audio;

  return { audioUrl, audioBase64 };
}

async function main() {
  const outDir = path.join(__dirname, '../android/app/src/main/assets/audio');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const voiceCode of VBEE_VOICES) {
    console.log(`\n=== DOWNLOADING FOR VOICE: ${voiceCode} ===`);
    for (const word of WORDS) {
      const cacheKey = getCacheKey(word, voiceCode);
      const fileName = `vbee_${cacheKey}.mp3`;
      const dest = path.join(outDir, fileName);

      if (fs.existsSync(dest)) {
        console.log(`[SKIP] ${word} (${voiceCode}) -> ${fileName} (already exists)`);
        continue;
      }

      try {
        console.log(`[FETCH] ${word} (${voiceCode})...`);
        const { audioUrl, audioBase64 } = await fetchFromVbee(word, voiceCode);
        
        if (audioUrl) {
          await downloadAudio(audioUrl, dest);
          console.log(`   -> Downloaded to ${fileName}`);
        } else if (audioBase64) {
          const buffer = Buffer.from(audioBase64, 'base64');
          fs.writeFileSync(dest, buffer);
          console.log(`   -> Saved base64 to ${fileName}`);
        } else {
          console.log(`   -> ERROR: No audio data`);
        }
      } catch (e) {
        console.error(`   -> FAILED:`, e.message);
      }
      
      // Slight delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  console.log('DONE ALL VOICES!');
}

main();
