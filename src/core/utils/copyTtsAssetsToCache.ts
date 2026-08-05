import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '@core/utils/logger';

// Tăng version này mỗi khi có audio assets mới để buộc copy lại
const TTS_ASSETS_VERSION = 'v6';
const TTS_COPIED_KEY = `has_copied_tts_assets_${TTS_ASSETS_VERSION}`;

export const copyTtsAssetsToCache = async (): Promise<void> => {
  try {
    const hasCopied = await AsyncStorage.getItem(TTS_COPIED_KEY);
    if (hasCopied === 'true') {
      return;
    }

    logger.info('[AppInit] Bắt đầu copy TTS assets vào Cache...');

    if (Platform.OS === 'android') {
      try {
        const assets = await RNFS.readDirAssets('tts');
        for (const file of assets) {
          if (file.name.endsWith('.mp3')) {
            const dest = `${RNFS.CachesDirectoryPath}/${file.name}`;
            const exists = await RNFS.exists(dest);
            if (!exists) {
              await RNFS.copyFileAssets(`tts/${file.name}`, dest);
            }
          }
        }
      } catch (e) {
        logger.warn('[AppInit] Không tìm thấy thư mục tts trong assets (Android)', e);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const bundlePath = `${RNFS.MainBundlePath}/tts`;
        const exists = await RNFS.exists(bundlePath);
        if (exists) {
          const files = await RNFS.readDir(bundlePath);
          for (const file of files) {
            if (file.name.endsWith('.mp3')) {
              const dest = `${RNFS.CachesDirectoryPath}/${file.name}`;
              const destExists = await RNFS.exists(dest);
              if (!destExists) {
                await RNFS.copyFile(file.path, dest);
              }
            }
          }
        }
      } catch (e) {
        logger.warn('[AppInit] Lỗi copy assets iOS', e);
      }
    }

    await AsyncStorage.setItem(TTS_COPIED_KEY, 'true');
    logger.info('[AppInit] Copy TTS assets hoàn tất!');
  } catch (e) {
    logger.error('[AppInit] Lỗi khi copy TTS assets', e);
  }
};
