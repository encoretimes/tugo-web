'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem from '@/components/nav/NavItem';
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  PlusCircleIcon,
  CurrencyDollarIcon,
  BookmarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useUnreadCount } from '@/hooks/useNotifications';
import PostComposerModal from '@/components/modals/PostComposerModal';
import { blackHanSans } from '@/app/fonts';
import { useUserStore } from '@/store/userStore';

const LeftSidebar = () => {
  const { data: unreadCount } = useUnreadCount();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <aside className="relative h-full border-r border-neutral-200 w-16 xl:w-64 flex flex-col">
      {/* 상단: TUGO 로고 */}
      <div className="mb-4 px-2 md:px-4 pt-2 md:pt-4">
        <Link href="/" className="flex items-center rounded-full py-2 xl:p-3">
          <div className="hidden xl:flex items-center gap-3 w-full">
            <Image
              src="/logo.svg"
              alt="TUGO"
              width={48}
              height={48}
              className="w-12 h-12 shrink-0"
            />
            <span
              className={`text-3xl bg-gradient-to-r from-primary-600 to-red-600 bg-clip-text text-transparent tracking-tight ${blackHanSans.className}`}
            >
              TUGO
            </span>
          </div>
          <div className="xl:hidden w-full flex justify-center">
            <Image
              src="/logo.svg"
              alt="TUGO"
              width={48}
              height={48}
              className="w-12 h-12"
              priority
            />
          </div>
        </Link>
      </div>

      {/* 상단: 메뉴 */}
      <nav className="px-2 md:px-4">
        <ul className="space-y-3 w-full">
          <NavItem
            href="/"
            icon={<HomeIcon className="h-7 w-7 stroke-[1.3]" />}
            label="홈"
          />
          <NavItem
            href="/notifications"
            icon={<BellIcon className="h-7 w-7 stroke-[1.3]" />}
            label="알림"
            badge={unreadCount}
          />
          <NavItem
            href="/notes"
            icon={<EnvelopeIcon className="h-7 w-7 stroke-[1.3]" />}
            label="쪽지"
          />
          <NavItem
            href="/points"
            icon={<CurrencyDollarIcon className="h-7 w-7 stroke-[1.3]" />}
            label="포인트"
          />
          {user?.hasCreator && (
            <li>
              <button
                onClick={() => setIsComposerOpen(true)}
                className="flex w-full items-center justify-center xl:justify-start space-x-2 rounded-full p-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                <div className="relative">
                  <PlusCircleIcon className="h-7 w-7" strokeWidth={1.3} />
                </div>
                <span className="hidden xl:inline">투고하기</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* 하단: 보관함 + 설정 */}
      <nav className="mt-auto px-2 md:px-4 pb-2 md:pb-4">
        <ul className="space-y-3 w-full">
          <NavItem
            href="/bookmarks"
            icon={<BookmarkIcon className="h-7 w-7 stroke-[1.3]" />}
            label="보관함"
          />
          <NavItem
            href="/settings"
            icon={<Cog6ToothIcon className="h-7 w-7 stroke-[1.3]" />}
            label="설정"
          />
        </ul>
      </nav>

      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </aside>
  );
};

export default LeftSidebar;
