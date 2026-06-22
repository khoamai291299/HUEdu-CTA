import {create} from 'zustand';

interface OnboardingState {
  skinTone: string;
  region: string;
  diagnosis: string;
  birthYear: number;
  themeColor: string;
  voiceId: string;
  username: string;
  setSkinTone: (v: string) => void;
  setRegion: (v: string) => void;
  setDiagnosis: (v: string) => void;
  setBirthYear: (v: number) => void;
  setThemeColor: (v: string) => void;
  setVoiceId: (v: string) => void;
  setUsername: (v: string) => void;
}

export const useOnboardingStore = create<OnboardingState>(set => ({
  skinTone: 'pale',
  region: 'North',
  diagnosis: 'Unknown',
  birthYear: 2020,
  themeColor: 'light',
  voiceId: 'neutral',
  username: '',
  setSkinTone: v => set({skinTone: v}),
  setRegion: v => set({region: v}),
  setDiagnosis: v => set({diagnosis: v}),
  setBirthYear: v => set({birthYear: v}),
  setThemeColor: v => set({themeColor: v}),
  setVoiceId: v => set({voiceId: v}),
  setUsername: v => set({username: v}),
}));
