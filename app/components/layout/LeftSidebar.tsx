'use client';

import React from 'react';
import NavItem from '@/components/nav/NavItem';
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  UserIcon as UserIconOutline,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';

const LeftSidebar = () => {
  const { user } = useUserStore();

  return (
    <aside className="flex h-screen flex-col justify-between border-r p-4">
      <div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Tugo</h2>
          <nav>
            <ul>
              <NavItem
                href="/"
                icon={<HomeIcon className="h-6 w-6" />}
                label="홈"
              />
              <NavItem
                href="/notifications"
                icon={<BellIcon className="h-6 w-6" />}
                label="알림"
              />
              <NavItem
                href="/messages"
                icon={<EnvelopeIcon className="h-6 w-6" />}
                label="쪽지"
              />
              <NavItem
                href="/parties"
                icon={<UserGroupIcon className="h-6 w-6" />}
                label="파티"
              />
              <NavItem
                href="/points"
                icon={<CurrencyDollarIcon className="h-6 w-6" />}
                label="포인트"
              />
              <NavItem
                href="/account"
                icon={<UserIconOutline className="h-6 w-6" />}
                label="내 계정"
              />
              <NavItem
                href="/more"
                icon={<EllipsisHorizontalIcon className="h-6 w-6" />}
                label="더보기"
              />
            </ul>
          </nav>
          <button className="w-full rounded-full bg-gray-800 py-2 font-bold text-white hover:bg-gray-900">
            투고하기
          </button>
        </div>
      </div>
      {user && (
        <div className="flex items-center space-x-2">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
              <UserIconOutline className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftSidebar;
