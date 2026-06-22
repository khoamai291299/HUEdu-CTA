/**
 * src/presentation/hooks/useTts.ts
 * Mục đích: Hook phát âm - bọc SpeakWord/SpeakSentence use case, tự lấy ngôn ngữ &
 *           hồ sơ đang dùng từ settings store (FR-01,02,03,07).
 * Dependency: services DI, Speak use cases, useSettingsStore, Vocabulary.
 */
import {useCallback} from 'react';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {SpeakWordUseCase} from '@domain/usecases/sentence/SpeakWordUseCase';
import {SpeakSentenceUseCase} from '@domain/usecases/sentence/SpeakSentenceUseCase';
import {getTts, getUsageRepo} from '@presentation/di/services';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {logger} from '@core/utils/logger';

export const useTts = () => {
  const settings = useSettingsStore(s => s.settings);

  const speakWord = useCallback(
    async (word: Vocabulary, recordUsage: boolean = true) => {
      try {
        await new SpeakWordUseCase(getTts(), getUsageRepo()).execute({
          vocabulary: word,
          childId: settings.activeChildId,
          lang: settings.language,
          recordUsage,
        });
      } catch (e) {
        logger.warn('[useTts] speakWord failed', e);
      }
    },
    [settings.activeChildId, settings.language],
  );

  const speakSentence = useCallback(
    async (words: Vocabulary[]) => {
      try {
        await new SpeakSentenceUseCase(getTts(), getUsageRepo()).execute({
          words,
          childId: settings.activeChildId,
          lang: settings.language,
        });
      } catch (e) {
        logger.warn('[useTts] speakSentence failed', e);
      }
    },
    [settings.activeChildId, settings.language],
  );

  const stop = useCallback(async () => {
    await getTts().stop();
  }, []);

  return {speakWord, speakSentence, stop};
};
