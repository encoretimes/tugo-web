import { create } from 'zustand';

interface User {
  name: string;
  username: string;
  profileImageUrl: string | null;
}

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: 'Tugo 사용자',
    username: 'tugouser',
    profileImageUrl: null,
  },
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
