'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import { useUserStore } from '@/store/userStore';

interface LoginPromptContextType {
  requireLogin: () => boolean;
}

const LoginPromptContext = createContext<LoginPromptContextType | null>(null);

export function LoginPromptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useUserStore();

  const requireLogin = () => {
    if (isAuthenticated) return false;
    setIsOpen(true);
    return true;
  };

  return (
    <LoginPromptContext.Provider value={{ requireLogin }}>
      {children}
      <LoginPromptModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isProtectedRoute={false}
      />
    </LoginPromptContext.Provider>
  );
}

export function useLoginPrompt() {
  const context = useContext(LoginPromptContext);
  if (!context) {
    throw new Error('useLoginPrompt must be used within LoginPromptProvider');
  }
  return context;
}
