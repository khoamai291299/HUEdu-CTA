/**
 * src/presentation/hooks/useAppInit.ts
 * Mục đích: Khởi động ứng dụng theo thứ tự: DI -> i18n -> DB (migration+seed) ->
 *           settings -> hồ sơ -> TTS -> dữ liệu bảng. Trả về trạng thái sẵn sàng/lỗi.
 * Dependency: registerDependencies, initI18n, services DI, các store, logger.
 */
import {useEffect, useState} from 'react';
import {registerDependencies} from '@core/di/registerDependencies';
import {Container} from '@core/di/Container';
import {initI18n} from '@core/i18n';
import {GlobalErrorHandler} from '@core/errors/GlobalErrorHandler';
import {getDb, getTts} from '@presentation/di/services';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {logger} from '@core/utils/logger';

interface InitState {
  ready: boolean;
  error: string | null;
  ttsAvailable: boolean;
}

export const useAppInit = (): InitState => {
  const [state, setState] = useState<InitState>({
    ready: false,
    error: null,
    ttsAvailable: true,
  });

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      try {
        GlobalErrorHandler.install();
        registerDependencies(Container.instance);
        initI18n();

        await getDb().init();

        await useSettingsStore.getState().load();
        await useChildStore.getState().load();
        await useChildStore.getState().ensureActive();

        let ttsAvailable = true;
        // Loại bỏ việc khởi tạo TTS ở màn hình Splash để tránh lỗi treo app hoàn toàn trên LDPlayer
        // TTS sẽ được khởi tạo "lười" (lazy) khi người dùng bấm nút đọc lần đầu tiên.
        
        await useVocabularyStore.getState().load();
        await useActivityStore.getState().load();
        const activeChildId =
          useSettingsStore.getState().settings.activeChildId;
        if (activeChildId != null) {
          await useVocabularyStore.getState().loadFavorites(activeChildId);
        }

        if (mounted) {
          setState({ready: true, error: null, ttsAvailable});
        }
      } catch (e) {
        logger.error('[useAppInit] bootstrap failed', e);
        if (mounted) {
          setState({
            ready: false,
            error: (e as Error)?.message ?? 'Khởi động thất bại',
            ttsAvailable: false,
          });
        }
      }
    };
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
