'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import NavItem from '@/components/nav/NavItem';
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  UserIcon as UserIconOutline,
  EllipsisHorizontalIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { Popover, Transition } from '@headlessui/react';

const LeftSidebar = () => {
  const { user } = useUserStore();

  return (
    <aside className="sticky top-0 flex h-screen flex-col justify-between border-r border-neutral-200 p-2 md:p-4">
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
              href="/account"
              icon={<UserIconOutline className="h-7 w-7" />}
              label="내 계정"
            />
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`w-full flex items-center gap-4 p-3 rounded-full transition-colors duration-200 text-lg hover:bg-neutral-100 ${open ? 'bg-neutral-100' : ''}`}
                  >
                    <EllipsisHorizontalIcon className="h-7 w-7" />
                    <span className="hidden xl:inline">더보기</span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute bottom-full mb-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="p-2">
                        <Link
                          href="/settings"
                          className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 hover:bg-neutral-100"
                        >
                          <Cog6ToothIcon className="h-6 w-6" />
                          <span className="font-semibold">설정</span>
                        </Link>
                        <Link
                          href="/archive"
                          className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 hover:bg-neutral-100"
                        >
                          <ArchiveBoxIcon className="h-6 w-6" />
                          <span className="font-semibold">보관함</span>
                        </Link>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </ul>
        </nav>
        <button className="mt-4 w-full rounded-full bg-primary-600 py-3 text-lg font-bold text-white hover:bg-primary-700">
          투고하기
        </button>
      </div>
      {user && (
        <div className="p-2">
          <div className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 cursor-pointer">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300">
                <UserIconOutline className="h-6 w-6 text-neutral-500" />
              </div>
            )}
            <div className="hidden xl:block">
              <div className="font-bold">{user.name}</div>
              <div className="text-sm text-neutral-500">@{user.username}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftSidebar;
