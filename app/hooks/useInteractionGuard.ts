'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getRouteType } from '@/config/routes';

interface UseInteractionGuardProps {
  onInteractionDetected: () => void;
  isModalOpen: boolean;
}

/**
 * SEO 프리뷰 페이지에서 사용자 상호작용을 감지하는 훅
 * 미인증 사용자가 클릭, 스크롤 등의 상호작용을 하면 로그인 팝업을 표시
 */
export function useInteractionGuard({
  onInteractionDetected,
  isModalOpen,
}: UseInteractionGuardProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useUserStore();
  const listenersActiveRef = useRef(false);

  const handleInteraction = useCallback(() => {
    const routeType = getRouteType(pathname);

    // SEO 프리뷰 페이지이고 미인증 사용자인 경우에만 작동
    if (routeType === 'seo-preview' && !isAuthenticated) {
      onInteractionDetected();
      listenersActiveRef.current = false;
    }
  }, [pathname, isAuthenticated, onInteractionDetected]);

  const attachListeners = useCallback(() => {
    if (listenersActiveRef.current) return;

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    listenersActiveRef.current = true;
  }, [handleInteraction]);

  const detachListeners = useCallback(() => {
    if (!listenersActiveRef.current) return;

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.removeEventListener(event, handleInteraction);
    });
    listenersActiveRef.current = false;
  }, [handleInteraction]);

  useEffect(() => {
    const routeType = getRouteType(pathname);

    // SEO 프리뷰 페이지가 아니거나 인증된 사용자면 리스너 등록 안함
    if (routeType !== 'seo-preview' || isAuthenticated) {
      detachListeners();
      return;
    }

    // 모달이 열려있으면 리스너 비활성화
    if (isModalOpen) {
      detachListeners();
      return;
    }

    // 모달이 닫혔으면 리스너 재등록
    attachListeners();

    return () => {
      detachListeners();
    };
  }, [
    pathname,
    isAuthenticated,
    isModalOpen,
    attachListeners,
    detachListeners,
  ]);
}
