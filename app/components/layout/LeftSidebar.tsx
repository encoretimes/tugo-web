'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavItem from '@/components/nav/NavItem';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useTotalUnreadCount } from '@/hooks/useNotes';
import PostComposerModal from '@/components/modals/PostComposerModal';
import { useUserStore } from '@/store/userStore';
import {
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';

const LeftSidebar = () => {
  const { data: unreadCount } = useUnreadCount();
  const notesUnreadCount = useTotalUnreadCount();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <aside className="relative flex h-full w-16 flex-col border-r border-gray-200 bg-white pt-4 dark:border-neutral-800 dark:bg-neutral-950 xl:w-64">
      {/* 로고 */}
      <div className="mb-6 px-1 xl:px-4">
        <Link
          href="/"
          className="flex items-center justify-center p-2 xl:justify-start"
        >
          {/* 축소 시 T. 로고 */}
          <Image
            src="/logo_one.svg"
            alt="Tugo"
            width={36}
            height={40}
            className="h-8 w-auto xl:hidden"
            priority
          />
          {/* 확장 시 Tugo. 전체 로고 */}
          <Image
            src="/logo.svg"
            alt="Tugo"
            width={120}
            height={44}
            className="hidden h-9 w-auto xl:block"
            priority
          />
        </Link>
      </div>

      {/* 상단: 메뉴 */}
      <nav className="px-1 xl:px-4">
        <ul className="w-full space-y-3">
          <NavItem
            href="/"
            icon={
              <Image
                src="/system_ico/home_pc.svg"
                alt="홈"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="홈"
            isCustomIcon
          />
          <NavItem
            href="/explore"
            icon={
              <Image
                src="/system_ico/explore_pc.svg"
                alt="탐색"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="탐색"
            isCustomIcon
          />
          {/* 숏폼 메뉴 - 아직 미구현으로 숨김 처리 */}
          {/* <NavItem
            href="/shortform"
            icon={
              <Image
                src="/system_ico/shortform_pc.svg"
                alt="숏폼"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            }
            label="숏폼"
            isCustomIcon
          /> */}
          <NavItem
            href="/notes"
            icon={
              <Image
                src="/system_ico/notes_pc.svg"
                alt="쪽지"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="쪽지"
            badge={notesUnreadCount}
            isCustomIcon
          />
          <NavItem
            href="/notifications"
            icon={
              <Image
                src="/system_ico/notification_pc.svg"
                alt="알림"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="알림"
            badge={unreadCount}
            isCustomIcon
          />
          <NavItem
            href="/bookmarks"
            icon={
              <Image
                src="/system_ico/bookmark_pc.svg"
                alt="보관함"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="보관함"
            isCustomIcon
          />
          {user && (
            <li>
              <button
                onClick={() => setIsComposerOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 p-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md active:bg-primary-800 xl:justify-start xl:px-4 xl:py-3"
              >
                <PencilSquareIcon className="h-6 w-6 flex-shrink-0" />
                <span className="hidden xl:inline">투고하기</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* 하단: 프로필 + 설정 */}
      <nav className="mt-auto px-1 pb-2 md:pb-4 xl:px-4">
        <ul className="w-full space-y-3">
          {user ? (
            <NavItem
              href={`/@${user.username}`}
              icon={
                <Image
                  src="/system_ico/profile_pc.svg"
                  alt="프로필"
                  width={28}
                  height={28}
                  className="h-7 w-7 dark:brightness-200 dark:invert"
                />
              }
              label="프로필"
              isCustomIcon
            />
          ) : (
            <NavItem
              href="/login"
              icon={
                <ArrowRightOnRectangleIcon className="h-7 w-7 text-neutral-700 dark:text-neutral-200" />
              }
              label="로그인"
            />
          )}
          <NavItem
            href="/settings"
            icon={
              <Image
                src="/system_ico/settings_pc.svg"
                alt="설정"
                width={28}
                height={28}
                className="h-7 w-7 dark:brightness-200 dark:invert"
              />
            }
            label="설정"
            isCustomIcon
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
