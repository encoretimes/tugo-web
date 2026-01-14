import { create } from 'zustand';

interface ComposerState {
  isOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
}

export const useComposerStore = create<ComposerState>((set) => ({
  isOpen: false,
  openComposer: () => set({ isOpen: true }),
  closeComposer: () => set({ isOpen: false }),
}));
