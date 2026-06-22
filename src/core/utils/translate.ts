/**
 * src/core/utils/translate.ts
 * Mục đích: Dịch tự động sử dụng Google Translate API miễn phí.
 */
import {logger} from './logger';

export async function translateText(
  text: string,
  sourceLang: 'vi' | 'en' = 'vi',
  targetLang: 'vi' | 'en' = 'en',
): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text,
    )}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // API trả về dạng: [[["Hello","Xin chào",null,null,1]],null,"vi",null,null,null,1,[]]
    let translatedText = '';
    if (data && data[0] && Array.isArray(data[0])) {
      data[0].forEach((item: any) => {
        if (item[0]) {
          translatedText += item[0];
        }
      });
    }
    return translatedText.trim();
  } catch (error) {
    logger.warn('[translateText] Dịch tự động thất bại', error);
    // Nếu lỗi mạng, trả về chuỗi rỗng để fallback
    return '';
  }
}
