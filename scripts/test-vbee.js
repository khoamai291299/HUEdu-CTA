const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM3NzUwMzF9.Pb5LUuUfm_aLRG11bkHfOg-ilomTtYkgSS1uRh8wrY8';
const text = 'Chào bạn';

const endpoints = [
  'https://api.vbee.vn/api/v1/tts',
  'https://vbee.vn/api/v1/convert-tts',
  'https://vbee.vn/api/v1/tts',
  'https://vbee.vn/api/v1/text2speech'
];

async function test() {
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: text,
          voice_code: 'hn_female_ngochuyen_full_48k-fhg'
        })
      });
      console.log(`${url}: ${res.status}`);
      if (res.ok) {
        console.log('Body:', await res.json());
      }
    } catch (e) {
      console.log(`${url}: Error ${e.message}`);
    }
  }
}
test();
