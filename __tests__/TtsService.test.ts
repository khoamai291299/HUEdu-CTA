/**
 * __tests__/TtsService.test.ts
 * Mục đích: Kiểm thử hợp đồng ITtsService thông qua MockTtsService (không gọi native).
 */
import {MockTtsService} from '@data/services/MockTtsService';

describe('MockTtsService (ITtsService)', () => {
  it('speak ghi lại văn bản & ngôn ngữ', async () => {
    const tts = new MockTtsService();
    await tts.speak('Xin chào', 'vi-VN');
    await tts.speak('Hello', 'vi-VN');

    expect(tts.spokenTexts).toEqual([
      {text: 'Xin chào', language: 'vi-VN'},
      {text: 'Hello', language: 'vi-VN'},
    ]);
  });

  it('setRate & setPitch cập nhật trạng thái', async () => {
    const tts = new MockTtsService();
    await tts.setRate(0.3);
    await tts.setPitch(1.5);
    expect(tts.rate).toBe(0.3);
    expect(tts.pitch).toBe(1.5);
  });

  it('hasVoiceForLanguage nhận diện tiền tố ngôn ngữ', async () => {
    const tts = new MockTtsService();
    await expect(tts.hasVoiceForLanguage('vi')).resolves.toBe(true);
    await expect(tts.hasVoiceForLanguage('fr')).resolves.toBe(false);
  });
});
