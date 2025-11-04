'use client';

import BottomNavBar from '@/components/layout/BottomNavBar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { useInteractionGuard } from '@/hooks/useInteractionGuard';
import { useUserStore } from '@/store/userStore';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading } = useUserStore();
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

  // 우측 패널을 숨길 페이지들
  const hideRightPanel =
    pathname.startsWith('/settings') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/bookmarks') ||
    /\/post\/\d+/.test(pathname); // 게시물 상세 페이지 (/@username/post/123)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-neutral-600 text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* 좌측 사이드바 - 독립적으로 화면 왼쪽에 고정, z-index 높음 */}
      <header className="hidden lg:block fixed left-0 top-0 z-20">
        <div className="h-screen overflow-y-auto">
          <LeftSidebar />
        </div>
      </header>

      {/* 3열 레이아웃 컨테이너 - 전체 화면 차지 */}
      <div className="flex w-full">
        {/* 왼쪽 빈 공간 - flex-1로 자동 대칭 */}
        {!hideRightPanel && (
          <div className="hidden lg:block lg:flex-1"></div>
        )}

        {/* 게시물 상세 페이지일 때만 헤더 크기만큼 빈 공간 */}
        {hideRightPanel && (
          <div className="hidden lg:block w-16 xl:w-64 shrink-0"></div>
        )}

        {/* 메인 컨텐츠 - 최대 너비 제한 */}
        <main className={`min-h-screen w-full ${
          hideRightPanel
            ? 'lg:max-w-4xl xl:max-w-5xl mx-auto'
            : 'lg:max-w-[576px] xl:max-w-[672px]'
        }`}>
          {children}
        </main>

        {/* 우측 사이드바 - flex-1로 왼쪽과 대칭 */}
        {!hideRightPanel && (
          <aside className="hidden lg:flex lg:flex-1">
            <div className="sticky top-0 h-screen overflow-y-auto w-full">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>
      <BottomNavBar />
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        isProtectedRoute={isProtectedRoute}
      />
      {modal}
    </div>
  );
}
