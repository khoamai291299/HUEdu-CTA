require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const APP_ID = 'ee06aef7-494b-4acc-8cda-4dd5611acceb';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const ENDPOINT = 'https://vbee.vn/api/v1/tts';

// Just doing for default voice to save space, but we can do for all if needed
const VOICE_CODE = 'hn_female_ngochuyen_full_48k-fhg';

const SEED_TEXTS = [
  // Greeting
  "... Xin chào, tôi là trợ lý hỗ trợ của bạn.",
  
  // Activities (speech texts only)
  "Con muốn đi vệ sinh",
  "Con muốn đi ngủ",
  "Con muốn đi dạo",
  "Con muốn đi tắm",
  "Con muốn rửa tay",
  "Con muốn đánh răng",
  "Con muốn về nhà",
  "Con muốn đi học",
  "Con muốn ăn cơm",
  "Con muốn uống nước",
  "Con muốn ăn bánh",
  "Con muốn uống sữa",
  "Con muốn chơi đồ chơi",
  "Con muốn đọc sách",
  "Con muốn nghe nhạc",
  "Con muốn xem tivi",
  "Con muốn vẽ tranh",
  "Con muốn ôm mẹ",
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

function getCacheKey(text, voiceCode) {
  return String(simpleHash(voiceCode + text.trim()));
}

async function downloadVbee(text, voiceCode) {
  const requestBody = {
    app_id: APP_ID,
    response_type: 'direct', // We might need to handle audio download if response_type is direct? No, if we use fetch or axios, it returns JSON if direct? Wait, if response_type is direct and there's no base64, we might need to fetch the audio_url and convert to base64.
    input_text: text,
    voice_code: voiceCode,
    audio_type: 'mp3',
    speed_rate: "1",
    bitrate: 128,
  };

  try {
    const res = await axios.post(ENDPOINT, requestBody, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    const data = res.data;
    const audioUrl = data.audio_url || data.result?.audio_url || data.result?.audio_link || data.audio_link || data.data?.audio_link;
    const audioBase64 = data.audio || data.result?.audio;

    if (audioBase64) {
      return audioBase64;
    } else if (audioUrl) {
      // Fetch audio file and convert to base64
      const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      return Buffer.from(audioRes.data, 'binary').toString('base64');
    }
  } catch (e) {
    console.error('Error fetching text:', text, e.response?.data || e.message);
  }
  return null;
}

const ALL_VOICES = [
  'hn_female_ngochuyen_full_48k-fhg',
  'hn_male_manhdung_news_48k-phg',
  'hn_female_nganha_child_22k-vc',
  'hn_male_vietbach_child_22k-vc',
  'sg_female_tuongvy_call_44k-fhg',
  'hn_male_minhquan_yt-stable',
];

async function run() {
  const outDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'tts');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const uniqueTexts = Array.from(new Set(SEED_TEXTS.map(t => t.trim()).filter(Boolean)));
  console.log(`Starting download for ${uniqueTexts.length} texts across ${ALL_VOICES.length} voices`);

  for (const voiceCode of ALL_VOICES) {
    console.log(`\n--- Downloading for voice: ${voiceCode} ---`);
    for (let i = 0; i < uniqueTexts.length; i++) {
      const text = uniqueTexts[i];
      const key = getCacheKey(text, voiceCode);
      const filePath = path.join(outDir, `vbee_${key}.mp3`);

      if (fs.existsSync(filePath)) {
        console.log(`[${i + 1}/${uniqueTexts.length}] Skip existing: ${text}`);
        continue;
      }

      console.log(`[${i + 1}/${uniqueTexts.length}] Downloading: ${text}`);
      const b64 = await downloadVbee(text, voiceCode);
      if (b64) {
        fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
      } else {
        console.log(`Failed for: ${text}`);
      }
      // Wait a bit to not overwhelm API
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

run();
