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
}: {
  children: React.ReactNode;
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
    pathname.startsWith('/bookmarks');

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
      <div className="mx-auto flex max-w-screen-xl">
        <header className="hidden lg:block lg:w-1/4">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <LeftSidebar />
          </div>
        </header>
        <main
          className={`min-h-screen w-full border-x ${hideRightPanel ? 'lg:w-3/4' : 'lg:w-1/2'}`}
        >
          {children}
        </main>
        {!hideRightPanel && (
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-0 h-screen overflow-y-auto">
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
    </div>
  );
}
