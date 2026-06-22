/**
 * src/domain/usecases/sentence/SpeakWordUseCase.ts
 * Mục đích: Phát âm một từ và ghi lịch sử sử dụng (FR-01, FR-03, FR-07).
 * OOP: kế thừa BaseUseCase, dependency injection qua constructor.
 * Dependency: ITtsService, IUsageHistoryRepository, Vocabulary.
 */
import {BaseUseCase} from '@core/base/BaseUseCase';
import {ITtsService, SpeakLanguage} from '@domain/services/ITtsService';
import {IUsageHistoryRepository} from '@domain/repositories/IUsageHistoryRepository';
import {Vocabulary} from '@domain/entities/Vocabulary';

export interface SpeakWordParams {
  vocabulary: Vocabulary;
  childId: number | null;
  lang: 'vi' | 'en';
  recordUsage?: boolean;
}

export class SpeakWordUseCase extends BaseUseCase<SpeakWordParams, void> {
  constructor(
    private readonly tts: ITtsService,
    private readonly usageRepo: IUsageHistoryRepository,
  ) {
    super();
  }

  async execute(params: SpeakWordParams): Promise<void> {
    const {vocabulary, childId, lang, recordUsage = true} = params;
    const speakLang: SpeakLanguage = lang === 'en' ? 'en-US' : 'vi-VN';
    await this.tts.speak(vocabulary.speechText(lang), speakLang);
    if (childId != null && recordUsage) {
      await this.usageRepo.record(childId, vocabulary.id, 'board_tap');
    }
  }
}
