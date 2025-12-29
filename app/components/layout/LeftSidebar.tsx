'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavItem from '@/components/nav/NavItem';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useTotalUnreadCount } from '@/hooks/useNotes';
import PostComposerModal from '@/components/modals/PostComposerModal';
import { useUserStore } from '@/store/userStore';

const LeftSidebar = () => {
  const { data: unreadCount } = useUnreadCount();
  const notesUnreadCount = useTotalUnreadCount();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <aside className="relative h-full w-16 xl:w-64 flex flex-col pt-4 border-r border-gray-200">
      {/* 로고 */}
      <div className="px-1 xl:px-4 mb-6 h-8 flex items-center justify-center xl:justify-start">
        <Link href="/" className="flex items-center">
          {/* 축소 시 T 로고 */}
          <Image
            src="/logo_one.svg"
            alt="TUGO"
            width={28}
            height={32}
            className="h-8 w-auto xl:hidden"
            priority
          />
          {/* 확장 시 TUGO 전체 로고 */}
          <Image
            src="/logo.svg"
            alt="TUGO"
            width={80}
            height={32}
            className="h-8 w-auto hidden xl:block"
            priority
          />
        </Link>
      </div>

      {/* 상단: 메뉴 */}
      <nav className="px-1 xl:px-4">
        <ul className="space-y-3 w-full">
          <NavItem
            href="/"
            icon={
              <Image
                src="/system_ico/home_pc.svg"
                alt="홈"
                width={28}
                height={28}
                className="w-7 h-7"
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
                className="w-7 h-7"
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
                className="w-7 h-7"
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
                className="w-7 h-7"
              />
            }
            label="알림"
            badge={unreadCount}
            isCustomIcon
          />
          {user && (
            <NavItem
              href="#"
              onClick={() => setIsComposerOpen(true)}
              icon={
                <Image
                  src="/system_ico/write_pc.svg"
                  alt="투고하기"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              }
              label="투고하기"
              isCustomIcon
            />
          )}
        </ul>
      </nav>

      {/* 하단: 보관함 + 프로필 */}
      <nav className="mt-auto px-1 xl:px-4 pb-2 md:pb-4">
        <ul className="space-y-3 w-full">
          <NavItem
            href="/bookmarks"
            icon={
              <Image
                src="/system_ico/bookmark_pc.svg"
                alt="보관함"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            }
            label="보관함"
            isCustomIcon
          />
          <NavItem
            href={user ? `/@${user.username}` : '/login'}
            icon={
              <Image
                src="/system_ico/profile_pc.svg"
                alt="프로필"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            }
            label="프로필"
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
