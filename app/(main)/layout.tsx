'use client';

import BottomNavBar from '@/components/layout/BottomNavBar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import MainHeader from '@/components/layout/MainHeader';
import RightSidebar from '@/components/layout/RightSidebar';
import FeedTabs from '@/components/feed/FeedTabs';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import PostComposerModal from '@/components/modals/PostComposerModal';
import NotesWebSocketInitializer from '@/components/NotesWebSocketInitializer';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { useInteractionGuard } from '@/hooks/useInteractionGuard';
import { useUserStore } from '@/store/userStore';
import { useComposerStore } from '@/store/composerStore';
import { usePathname } from 'next/navigation';
import React, { useRef, useState, useCallback } from 'react';

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathname = usePathname();
  const { hasHydrated, isAuthenticated } = useUserStore();
  const { isOpen: isComposerOpen, closeComposer } = useComposerStore();
  const {
    showLoginPrompt,
    closeLoginPrompt,
    triggerLoginPrompt,
    isProtectedRoute,
  } = useRouteGuard();

  useInteractionGuard({
    onInteractionDetected: triggerLoginPrompt,
    isModalOpen: showLoginPrompt,
  });

  const hideRightPanel =
    pathname.startsWith('/settings') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/bookmarks') ||
    pathname.startsWith('/notes') ||
    pathname.startsWith('/profile/') ||
    /\/@[^/]+\/post\/\d+/.test(pathname) ||
    /^\/post\/\d+$/.test(pathname);

  // 홈 페이지에서만 모바일 피드 탭 표시
  const showMobileFeedTabs = pathname === '/' && hasHydrated && isAuthenticated;

  // Pull-to-refresh 상태
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const THRESHOLD = 80;

  const enablePullToRefresh = pathname === '/' && hasHydrated;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enablePullToRefresh || isRefreshing) return;
      const container = scrollRef.current;
      if (container && container.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    },
    [enablePullToRefresh, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling.current || !enablePullToRefresh || isRefreshing) return;
      const container = scrollRef.current;
      if (!container) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY.current);
      const dampedDistance = Math.min(distance * 0.4, THRESHOLD * 1.2);
      setPullDistance(dampedDistance);
    },
    [enablePullToRefresh, isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || !enablePullToRefresh) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      // 커스텀 이벤트로 Feed에 refetch 트리거
      window.dispatchEvent(new CustomEvent('pulltorefresh'));
      // 최소 500ms 로딩 표시
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsRefreshing(false);
    }

    setPullDistance(0);
  }, [pullDistance, isRefreshing, enablePullToRefresh]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-white dark:bg-neutral-950" />;
  }

  return (
    <div
      className="
        bg-white dark:bg-neutral-950
        fixed inset-0 flex flex-col h-dvh-safe
        lg:relative lg:inset-auto lg:block lg:h-auto lg:min-h-screen
      "
    >
      <NotesWebSocketInitializer />

      {/* 모바일 상단 헤더 - shell 안에서 상대 위치 */}
      <MainHeader />

      {/* 모바일 전용 피드 탭 - 스크롤 영역 밖에 고정 */}
      {showMobileFeedTabs && (
        <FeedTabs className="flex-shrink-0 lg:hidden px-4" />
      )}

      {/* 스크롤 가능한 메인 영역 */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="
          flex-1 overflow-y-auto overflow-x-hidden
          lg:overflow-visible lg:flex-none
          main-scroll-area
        "
      >
        {/* Pull-to-refresh 인디케이터 (모바일 홈 전용) */}
        {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
          <div
            className="pull-to-refresh-indicator lg:hidden"
            style={{
              transform: `translateY(${isRefreshing ? 0 : pullDistance - 40}px)`,
              opacity: isRefreshing ? 1 : Math.min(pullDistance / THRESHOLD, 1),
            }}
          >
            <svg
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: isRefreshing ? 'none' : `rotate(${pullDistance * 3}deg)`,
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isRefreshing ? '새로고침 중...' : '당겨서 새로고침'}</span>
          </div>
        )}
        <div className="max-w-content mx-auto">
          <div className="flex">
            {/* 왼쪽 사이드바 */}
            <div className="hidden lg:block lg:w-16 xl:w-64 flex-shrink-0">
              <div className="sticky top-0 h-screen">
                <LeftSidebar />
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <main className="w-full flex-1 min-w-0">
              <div className="px-0 lg:px-6 pt-4">{children}</div>
            </main>

            {/* 우측 사이드바 */}
            {!hideRightPanel && (
              <aside className="hidden lg:block lg:w-80 flex-shrink-0 border-l border-gray-200 dark:border-neutral-800">
                <div className="sticky top-0 h-screen overflow-y-auto">
                  <RightSidebar />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 하단 네비 - shell 안에서 상대 위치 */}
      <BottomNavBar />

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        isProtectedRoute={isProtectedRoute}
      />
      <PostComposerModal isOpen={isComposerOpen} onClose={closeComposer} />
      {modal}
    </div>
  );
}
