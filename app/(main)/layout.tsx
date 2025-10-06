'use client';

import BottomNavBar from '@/components/layout/BottomNavBar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { useInteractionGuard } from '@/hooks/useInteractionGuard';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showLoginPrompt, closeLoginPrompt, triggerLoginPrompt, isProtectedRoute } =
    useRouteGuard();

  // SEO 프리뷰 페이지에서 사용자 상호작용 감지
  useInteractionGuard({
    onInteractionDetected: triggerLoginPrompt,
    isModalOpen: showLoginPrompt,
  });

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto flex max-w-screen-xl">
        <header className="hidden lg:block lg:w-1/4">
          <LeftSidebar />
        </header>
        <main className="min-h-screen w-full border-x lg:w-1/2">
          {children}
        </main>
        <aside className="hidden lg:block lg:w-1/4">
          <RightSidebar />
        </aside>
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
