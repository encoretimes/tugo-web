import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';

export function useRequireAuth() {
  const { user } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);

  const checkAuth = useCallback(
    (message = '로그인이 필요합니다') => {
      if (!user) {
        addToast(message, 'warning');
        return false;
      }
      return true;
    },
    [user, addToast]
  );

  return {
    checkAuth,
    isAuthenticated: !!user,
    user,
  };
}
