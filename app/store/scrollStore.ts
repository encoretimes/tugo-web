import { create } from 'zustand';

interface ScrollState {
  feedScrollPosition: number;
  setFeedScrollPosition: (position: number) => void;
  clearFeedScrollPosition: () => void;
}

/**
 * 피드 스크롤 위치를 저장하는 Zustand 스토어
 * 게시물 상세 페이지에서 뒤로가기 시 스크롤 위치를 복원하기 위해 사용
 */
export const useScrollStore = create<ScrollState>((set) => ({
  feedScrollPosition: 0,
  setFeedScrollPosition: (position: number) =>
    set({ feedScrollPosition: position }),
  clearFeedScrollPosition: () => set({ feedScrollPosition: 0 }),
}));
