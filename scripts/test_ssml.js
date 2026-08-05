const axios = require('axios');

async function test() {
  const requestBody = {
    app_id: 'ee06aef7-494b-4acc-8cda-4dd5611acceb',
    response_type: 'direct',
    input_text: '<speak><break time="500ms"/>Xin chào</speak>',
    voice_code: 'hn_male_manhdung_news_48k-phg',
  };

  try {
    const res = await axios.post('https://vbee.vn/api/v1/tts', requestBody, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8`,
        'Content-Type': 'application/json',
      }
    });
    console.log("Success:", !!res.data.audio_url || !!res.data.result?.audio_url || !!res.data.audio_link);
    console.log(res.data);
  } catch (e) {
    console.error("Error:", e.response?.data || e.message);
  }
}
test();
