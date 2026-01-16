'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import UsernameSetupModal from '@/components/modals/UsernameSetupModal';
import { isPWAStandalone } from '@/lib/oauth-popup';
import { getTokens, clearTokens } from '@/lib/token-storage';
import { getApiUrl, AUTH_CONFIG } from '@/config/env';

/**
 * PWA 세션 복구 시도
 * IndexedDB에 저장된 토큰으로 쿠키 기반 세션 복원
 */
async function tryRestorePWASession(): Promise<boolean> {
  try {
    const tokens = await getTokens();
    if (!tokens) {
      return false;
    }

    // 토큰 유효성 검사
    const tokenAge = Date.now() - tokens.savedAt;
    if (tokenAge > AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE_MS) {
      await clearTokens();
      return false;
    }

    // 세션 복원 API 호출
    const response = await fetch(`${getApiUrl()}/api/v1/auth/restore-session`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
    });

    if (response.ok) {
      console.log('[AuthProvider] PWA session restored successfully');
      return true;
    }

    // 복원 실패 시 저장된 토큰 삭제
    await clearTokens();
    return false;
  } catch (error) {
    console.error('[AuthProvider] PWA session restore failed:', error);
    return false;
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserStore();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const { data: currentUserData, error, refetch } = useCurrentUser();
  const hasProcessed = useRef(false);
  const hasAttemptedRestore = useRef(false);

  // PWA 세션 복구 로직
  const attemptPWASessionRestore = useCallback(async () => {
    if (hasAttemptedRestore.current) return;
    hasAttemptedRestore.current = true;

    // PWA 모드가 아니면 스킵
    if (!isPWAStandalone()) return;

    setIsRestoringSession(true);
    try {
      const restored = await tryRestorePWASession();
      if (restored) {
        // 세션 복원 성공 시 사용자 정보 다시 가져오기
        await refetch();
      }
    } finally {
      setIsRestoringSession(false);
    }
  }, [refetch]);

  // PWA 세션 복구 (에러 발생 시)
  useEffect(() => {
    if (error && !hasAttemptedRestore.current && isPWAStandalone()) {
      attemptPWASessionRestore();
    }
  }, [error, attemptPWASessionRestore]);

  useEffect(() => {
    // 세션 복구 중이면 스킵
    if (isRestoringSession) return;

    // 이미 처리했으면 스킵
    if (hasProcessed.current && !currentUserData) {
      return;
    }

    if (error) {
      if (!hasProcessed.current && hasAttemptedRestore.current) {
        setUser(null);
        hasProcessed.current = true;
      }
      return;
    }

    if (currentUserData) {
      const { member } = currentUserData;

      setUser({
        id: member.id,
        displayName: member.displayName,
        email: member.email,
        role: member.role,
        profileImageUrl: null,
        username: member.username,
      });

      if (!member.username) {
        setShowUsernameModal(true);
      }

      hasProcessed.current = true;
    }
  }, [currentUserData, error, setUser, isRestoringSession]);

  const handleUsernameModalClose = (username: string) => {
    if (username) {
      setShowUsernameModal(false);
    }
  };

  return (
    <>
      {children}
      <UsernameSetupModal
        isOpen={showUsernameModal}
        onClose={handleUsernameModalClose}
      />
    </>
  );
}
