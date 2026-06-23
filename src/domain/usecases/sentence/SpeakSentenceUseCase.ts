/**
 * src/domain/usecases/sentence/SpeakSentenceUseCase.ts
 * Mục đích: Đọc toàn bộ câu đã ghép & ghi lịch sử cho từng từ (FR-02, FR-03, FR-07).
 * Dependency: ITtsService, IUsageHistoryRepository, SentenceBuilder, Vocabulary.
 */
import {BaseUseCase} from '@core/base/BaseUseCase';
import {ITtsService} from '@domain/services/ITtsService';
import {IUsageHistoryRepository} from '@domain/repositories/IUsageHistoryRepository';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {SentenceBuilder} from './SentenceBuilder';

export interface SpeakSentenceParams {
  words: Vocabulary[];
  childId: number | null;
}

export class SpeakSentenceUseCase extends BaseUseCase<SpeakSentenceParams, void> {
  constructor(
    private readonly tts: ITtsService,
    private readonly usageRepo: IUsageHistoryRepository,
  ) {
    super();
  }

  async execute(params: SpeakSentenceParams): Promise<void> {
    const {words, childId} = params;
    if (words.length === 0) {
      return;
    }
    const text = SentenceBuilder.buildText(words);
    await this.tts.speak(text, 'vi-VN');
    if (childId != null) {
      for (const w of words) {
        await this.usageRepo.record(childId, w.id, 'sentence_speak');
      }
    }
  }
}
