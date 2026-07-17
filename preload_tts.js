const fs = require('fs');
const path = require('path');

const VBEE_APP_ID = 'ee06aef7-494b-4acc-8cda-4dd5611acceb';
const VBEE_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const ENDPOINT = 'https://vbee.vn/api/v1/tts';

const VOICES = [
  'hn_female_ngochuyen_full_48k-fhg',
  'hn_male_manhdung_news_48k-phg',
  'hn_female_nganha_child_22k-vc',
  'hn_male_vietbach_child_22k-vc',
  'sg_female_tuongvy_call_44k-fhg',
  'hn_male_minhquan_yt-stable'
];

const PHRASES = [
  "... Xin chào, tôi là trợ lý hỗ trợ của bạn.",
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
  "Con muốn ôm mẹ"
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

async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function main() {
  const destDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'tts');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  let total = VOICES.length * PHRASES.length;
  let count = 0;

  for (const voice of VOICES) {
    for (const text of PHRASES) {
      count++;
      const cacheKey = getCacheKey(text, voice);
      const targetPath = path.join(destDir, `vbee_${cacheKey}.mp3`);
      
      if (fs.existsSync(targetPath)) {
        console.log(`[${count}/${total}] EXISTS: ${targetPath}`);
        continue;
      }

      console.log(`[${count}/${total}] Fetching: ${text} (${voice})`);
      try {
        const body = {
          app_id: VBEE_APP_ID,
          response_type: 'direct',
          input_text: text,
          voice_code: voice,
          audio_type: 'mp3',
          speed_rate: "1",
          bitrate: 128
        };

        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${VBEE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const rawText = await res.text();
        if (!res.ok) {
          throw new Error(`API Error: ${rawText}`);
        }

        const data = JSON.parse(rawText);
        const audioUrl = data.audio_url || data.result?.audio_url || data.result?.audio_link || data.audio_link || data.data?.audio_link;
        const audioBase64 = data.audio || data.result?.audio;

        if (audioUrl) {
          await downloadFile(audioUrl, targetPath);
        } else if (audioBase64) {
          fs.writeFileSync(targetPath, Buffer.from(audioBase64, 'base64'));
        } else {
          console.error(`No audio data: ${rawText.substring(0, 100)}`);
        }
        
        await delay(300); // Ngăn chống spam API
      } catch (err) {
        console.error(`ERROR fetching ${text}:`, err.message);
      }
    }
  }
  console.log('DONE!');
}

main();
