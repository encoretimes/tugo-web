import BottomNavBar from '@/components/layout/BottomNavBar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    </div>
  );
}
