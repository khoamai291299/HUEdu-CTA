/**
 * src/presentation/stores/useSentenceStore.ts
 * Mục đích: Trạng thái câu đang ghép trên bảng giao tiếp (FR-02).
 *           Dùng logic thuần SentenceBuilder để thao tác bất biến.
 * Dependency: zustand, SentenceBuilder, Vocabulary.
 */
import {create} from 'zustand';
import {Vocabulary} from '@domain/entities/Vocabulary';
import {SentenceBuilder} from '@domain/usecases/sentence/SentenceBuilder';

interface SentenceState {
  words: Vocabulary[];
  add: (word: Vocabulary) => void;
  removeAt: (index: number) => void;
  removeLast: () => void;
  clear: () => void;
}

export const useSentenceStore = create<SentenceState>(set => ({
  words: [],
  add: word =>
    set(state => ({words: SentenceBuilder.addWord(state.words, word)})),
  removeAt: index =>
    set(state => ({words: SentenceBuilder.removeAt(state.words, index)})),
  removeLast: () =>
    set(state => ({words: SentenceBuilder.removeLast(state.words)})),
  clear: () => set({words: SentenceBuilder.clear()}),
}));
