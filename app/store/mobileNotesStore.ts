'use client';

import { create } from 'zustand';

interface SelectedChat {
  userId: number;
  userName?: string;
  profileImage?: string;
}

interface MobileNotesState {
  isOpen: boolean;
  currentView: 'list' | 'chat' | null;
  isListExiting: boolean;
  isChatExiting: boolean;
  selectedChat: SelectedChat | null;
}

interface MobileNotesActions {
  openNotes: () => void;
  openChat: (chat: SelectedChat) => void;
  goBackFromChat: () => void;
  goBackFromList: () => void;
  finishListExit: () => void;
  finishChatExit: () => void;
}

export const useMobileNotesStore = create<MobileNotesState & MobileNotesActions>(
  (set) => ({
    isOpen: false,
    currentView: null,
    isListExiting: false,
    isChatExiting: false,
    selectedChat: null,

    openNotes: () => set({ isOpen: true, currentView: 'list' }),

    openChat: (chat) => set({ currentView: 'chat', selectedChat: chat }),

    goBackFromChat: () => set({ isChatExiting: true }),

    goBackFromList: () => set({ isListExiting: true }),

    finishChatExit: () =>
      set({
        isChatExiting: false,
        currentView: 'list',
        selectedChat: null,
      }),

    finishListExit: () =>
      set({
        isListExiting: false,
        isOpen: false,
        currentView: null,
      }),
  })
);
