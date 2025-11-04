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
  UserIcon as UserIconOutline,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { useUnreadCount } from '@/hooks/useNotifications';
import PostComposerModal from '@/components/modals/PostComposerModal';

const LeftSidebar = () => {
  const { user } = useUserStore();
  const { data: unreadCount } = useUnreadCount();
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <aside className="flex h-full flex-col p-2 md:p-4 border-r border-neutral-200 w-16 xl:w-64">
      {/* 상단: TUGO 로고 */}
      <div>
        <Link href="/" className="p-3 block">
          <div className="hidden xl:flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Tugo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold">Tugo</span>
          </div>
          <div className="xl:hidden flex justify-center">
            <Image
              src="/logo-compact.svg"
              alt="T"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </Link>
      </div>

      {/* 중간: 메뉴 (세로 중앙 정렬) */}
      <nav className="flex-1 flex items-center justify-center">
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
            href="/messages"
            icon={<EnvelopeIcon className="h-7 w-7 stroke-[1.3]" />}
            label="쪽지"
          />
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
          <NavItem
            href="/points"
            icon={<CurrencyDollarIcon className="h-7 w-7 stroke-[1.3]" />}
            label="포인트"
          />
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

      {/* 하단: 프로필 */}
      {user && (
        <div className="p-2">
          <Link
            href={user.username ? `/profile/${user.username}` : '/settings'}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-300">
                <UserIconOutline className="h-6 w-6 text-neutral-500" />
              </div>
            )}
            <div className="hidden xl:block overflow-hidden min-w-0">
              <div className="font-bold truncate">{user.name}</div>
              <div className="text-sm text-neutral-500 truncate">
                {user.username ? `@${user.username}` : 'username 미설정'}
              </div>
            </div>
          </Link>
        </div>
      )}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </aside>
  );
};

export default LeftSidebar;
