'use client';

import BottomNavBar from '@/components/layout/BottomNavBar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import MainHeader from '@/components/layout/MainHeader';
import RightSidebar from '@/components/layout/RightSidebar';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import PostComposerModal from '@/components/modals/PostComposerModal';
import NotesWebSocketInitializer from '@/components/NotesWebSocketInitializer';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { useInteractionGuard } from '@/hooks/useInteractionGuard';
import { useUserStore } from '@/store/userStore';
import { useComposerStore } from '@/store/composerStore';
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
  const { hasHydrated } = useUserStore();
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

      {/* 스크롤 가능한 메인 영역 */}
      <div
        className="
          flex-1 overflow-y-auto overflow-x-hidden
          lg:overflow-visible lg:flex-none
        "
      >
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
