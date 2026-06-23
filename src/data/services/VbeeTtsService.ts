/**
 * src/data/services/VbeeTtsService.ts
 * Mục đích: Hiện thực ITtsService bằng Vbee REST API.
 *           Gọi API Vbee để chuyển văn bản thành giọng nói chất lượng cao.
 *           Fallback về LocalTtsService nếu API không khả dụng.
 * Dependency: ITtsService, vbeeConfig, react-native-fs, react-native-sound hoặc expo-av.
 */
import RNFS from 'react-native-fs';
import {
  ITtsService,
  SpeakLanguage,
  TtsVoice,
} from '@domain/services/ITtsService';
import {VBEE_CONFIG, VBEE_VOICES} from '@core/config/vbeeConfig';
import {LocalTtsService} from './LocalTtsService';
import {logger} from '@core/utils/logger';
import TrackPlayer, {Capability} from 'react-native-track-player';

/**
 * Simple audio player using react-native-tts as fallback 
 * and fetch + file-based playback for Vbee audio.
 */
export class VbeeTtsService implements ITtsService {
  private localTts: LocalTtsService;
  private currentVoiceCode: string = VBEE_VOICES[0].voiceCode;
  private speed: number = VBEE_CONFIG.defaultSpeed;
  private isVbeeAvailable: boolean = false;

  constructor() {
    this.localTts = new LocalTtsService();
    // Check if Vbee token is configured
    this.isVbeeAvailable = 
      VBEE_CONFIG.accessToken !== 'YOUR_ACCESS_TOKEN' && 
      VBEE_CONFIG.accessToken.length > 10;
  }

  async init(): Promise<void> {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      });
      logger.info('[VbeeTtsService] TrackPlayer initialized');
    } catch (e) {
      logger.warn('[VbeeTtsService] TrackPlayer init failed, might already be initialized', e);
    }

    // Always init local TTS as fallback
    try {
      await this.localTts.init();
    } catch (_e) {
      logger.debug('[VbeeTtsService] Local TTS init failed (will use Vbee only)');
    }
    
    if (this.isVbeeAvailable) {
      logger.info('[VbeeTtsService] Vbee TTS is configured and available');
    } else {
      logger.info('[VbeeTtsService] Vbee token not configured, using local TTS fallback');
    }
  }

  async speak(text: string, _language: SpeakLanguage): Promise<void> {
    if (!text.trim()) return;

    if (this.isVbeeAvailable) {
      try {
        await this.speakWithVbee(text);
        return;
      } catch (e) {
        logger.warn('[VbeeTtsService] Vbee API failed, falling back to local TTS', e);
      }
    }

    // Fallback to local TTS
    await this.localTts.speak(text, 'vi-VN');
  }

  private async speakWithVbee(text: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VBEE_CONFIG.timeout);

    try {
      const response = await fetch(VBEE_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VBEE_CONFIG.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: text,
          voice_code: this.currentVoiceCode,
          speed: this.speed,
          format: VBEE_CONFIG.format,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Vbee API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Vbee API may return audio_url or direct audio data
      if (data.audio_url) {
        await this.playAudioFromUrl(data.audio_url);
      } else if (data.audio) {
        // If direct base64 audio data
        await this.playAudioFromBase64(data.audio);
      } else {
        throw new Error('No audio data in Vbee response');
      }
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  private async playAudioFromUrl(url: string): Promise<void> {
    const filePath = `${RNFS.CachesDirectoryPath}/vbee_tts_temp.mp3`;
    
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;

    // Use react-native built-in audio playback
    // For simplicity, we'll use the local TTS as a bridge
    // In production, integrate react-native-sound or expo-av
    logger.info('[VbeeTtsService] Audio downloaded to:', filePath);
    
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'vbee_tts',
        url: 'file://' + filePath,
        title: 'Vbee TTS',
        artist: 'HUEdu-CTA',
      });
      await TrackPlayer.setRate(this.speed);
      await TrackPlayer.play();
    } catch (e) {
      logger.error('[VbeeTtsService] Failed to play audio with TrackPlayer', e);
      throw e;
    }
  }

  private async playAudioFromBase64(base64Data: string): Promise<void> {
    const filePath = `${RNFS.CachesDirectoryPath}/vbee_tts_temp.mp3`;
    await RNFS.writeFile(filePath, base64Data, 'base64');
    await this.playAudioFromUrl(filePath);
  }

  async stop(): Promise<void> {
    try {
      await TrackPlayer.stop();
    } catch (e) {
      // Ignore errors if it's not initialized
    }
    await this.localTts.stop();
  }

  async setRate(rate: number): Promise<void> {
    this.speed = rate > 0 ? rate * 2 : VBEE_CONFIG.defaultSpeed; // Normalize rate
    await this.localTts.setRate(rate);
  }

  async setPitch(pitch: number): Promise<void> {
    // Vbee doesn't have pitch control, but set it for local TTS fallback
    await this.localTts.setPitch(pitch);
  }

  async getVoices(): Promise<TtsVoice[]> {
    // Return Vbee voices + local voices
    const vbeeVoices: TtsVoice[] = VBEE_VOICES.map(v => ({
      id: v.id,
      name: v.label,
      language: 'vi-VN',
    }));

    if (!this.isVbeeAvailable) {
      // If Vbee not available, return local voices
      return this.localTts.getVoices();
    }

    return vbeeVoices;
  }

  async setVoice(voiceId: string): Promise<void> {
    // Check if it's a Vbee voice
    const vbeeVoice = VBEE_VOICES.find(v => v.id === voiceId);
    if (vbeeVoice) {
      this.currentVoiceCode = vbeeVoice.voiceCode;
      logger.info('[VbeeTtsService] Set Vbee voice:', vbeeVoice.label);
    } else {
      // It's a local voice
      await this.localTts.setVoice(voiceId);
    }
  }

  async hasVoiceForLanguage(languagePrefix: string): Promise<boolean> {
    if (languagePrefix.toLowerCase().startsWith('vi')) {
      return true; // Always have Vietnamese voices
    }
    return this.localTts.hasVoiceForLanguage(languagePrefix);
  }
}
