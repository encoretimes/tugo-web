'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getRouteType, RouteConfig } from '@/config/routes';

export function useRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isProtectedRoute, setIsProtectedRoute] = useState(false);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const routeType = getRouteType(pathname);

    // 기존 타이머 정리
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
      promptTimerRef.current = null;
    }

    // 완전 공개 페이지는 아무 제약 없음
    if (routeType === 'public') {
      setShowLoginPrompt(false);
      setIsProtectedRoute(false);
      return;
    }

    // SEO 프리뷰 페이지 (프로필): 일정 시간 후 로그인 팝업
    if (routeType === 'seo-preview' && !isAuthenticated) {
      setIsProtectedRoute(true); // 팝업 닫으면 뒤로가기
      promptTimerRef.current = setTimeout(() => {
        setShowLoginPrompt(true);
      }, RouteConfig.LOGIN_PROMPT_DELAY);

      return () => {
        if (promptTimerRef.current) {
          clearTimeout(promptTimerRef.current);
          promptTimerRef.current = null;
        }
      };
    }

    // 엄격한 보호 페이지: 즉시 로그인 페이지로 리다이렉트
    if (routeType === 'strict-protected' && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // 인증된 사용자는 팝업 표시 안함
    if (isAuthenticated) {
      setShowLoginPrompt(false);
      setIsProtectedRoute(false);
    }
  }, [pathname, isAuthenticated, router]);

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);

    // 보호된 페이지에서는 팝업을 닫으면 뒤로 가기
    if (isProtectedRoute) {
      router.back();
    }
  };

  const triggerLoginPrompt = () => {
    setShowLoginPrompt(true);
  };

  return {
    showLoginPrompt,
    closeLoginPrompt,
    triggerLoginPrompt,
    isProtectedRoute,
  };
}
