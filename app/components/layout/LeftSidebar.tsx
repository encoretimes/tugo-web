'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem from '@/components/nav/NavItem';
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
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
    <aside className="flex h-full flex-col justify-between border-r border-neutral-200 p-2 md:p-4">
      <div>
        <Link href="/" className="text-2xl font-bold p-3 block">
          Tugo
        </Link>
        <nav className="mt-4">
          <ul>
            <NavItem
              href="/"
              icon={<HomeIcon className="h-7 w-7" />}
              label="홈"
            />
            <NavItem
              href="/notifications"
              icon={<BellIcon className="h-7 w-7" />}
              label="알림"
              badge={unreadCount}
            />
            <NavItem
              href="/messages"
              icon={<EnvelopeIcon className="h-7 w-7" />}
              label="쪽지"
            />
            <NavItem
              href="/parties"
              icon={<UserGroupIcon className="h-7 w-7" />}
              label="파티"
            />
            <NavItem
              href="/points"
              icon={<CurrencyDollarIcon className="h-7 w-7" />}
              label="포인트"
            />
            <NavItem
              href="/settings"
              icon={<Cog6ToothIcon className="h-7 w-7" />}
              label="설정"
            />
          </ul>
        </nav>
        <button
          onClick={() => setIsComposerOpen(true)}
          className="mt-4 w-full rounded-full bg-primary-600 py-3 text-lg font-bold text-white hover:bg-primary-700"
        >
          투고하기
        </button>
      </div>
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
            <div className="hidden lg:block overflow-hidden min-w-0">
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
