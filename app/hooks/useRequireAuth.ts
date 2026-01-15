import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { useLoginPrompt } from '@/contexts/LoginPromptContext';

export function useRequireAuth() {
  const { user } = useUserStore();
  const { requireLogin } = useLoginPrompt();

  const checkAuth = useCallback(() => {
    if (!user) {
      requireLogin();
      return false;
    }
    return true;
  }, [user, requireLogin]);

  return {
    checkAuth,
    isAuthenticated: !!user,
    user,
  };
}
