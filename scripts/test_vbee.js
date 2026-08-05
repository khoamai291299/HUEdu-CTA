const axios = require('axios');
const APP_ID = 'ee06aef7-494b-4acc-8cda-4dd5611acceb';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const ENDPOINT = 'https://vbee.vn/api/v1/tts';

async function test() {
  const requestBody = {
    app_id: APP_ID,
    response_type: 'direct',
    input_text: 'Xin chào',
    voice_code: 'hn_female_ngochuyen_full_48k-fhg',
    audio_type: 'mp3',
    speed_rate: "1",
    bitrate: 128,
  };

  try {
    console.log("Sending request to Vbee...");
    const res = await axios.post(ENDPOINT, requestBody, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    console.log("Success:", Object.keys(res.data));
    console.log("Data:", JSON.stringify(res.data).substring(0, 200));
  } catch (e) {
    console.log("Error:", e.response?.status, e.response?.data || e.message);
  }
}
test();
