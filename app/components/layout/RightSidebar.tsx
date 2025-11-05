'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';

const RightSidebar = () => {
  const { user } = useUserStore();

  return (
    <aside className="h-full p-4 text-black">
      <div className="max-w-xs mx-auto">
        {/* 검색바 */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="검색"
            className="w-full rounded-full border-neutral-200 bg-gray-100 py-2 pl-10 pr-4 focus:border-primary-600 focus:ring-primary-600"
          />
        </div>

        {/* 프로필 & 추천 크리에이터 */}
        <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
          {/* 내 프로필 요약 */}
          {user && user.username && (
            <div className="p-4 border-b border-gray-200">
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-300">
                    <UserIcon className="h-6 w-6 text-neutral-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </Link>
            </div>
          )}

          {/* 추천 크리에이터 */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                추천 크리에이터
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between gap-2">
                <Link
                  href="/profile/minjun.kim"
                  className="flex items-center gap-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 min-w-0"
                >
                  <Image
                    src="https://i.pravatar.cc/150?u=minjun.kim"
                    alt="김민준"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      김민준
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      @minjun.kim
                    </div>
                  </div>
                </Link>
                <button className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700 shrink-0">
                  팔로우
                </button>
              </li>
              <li className="flex items-center justify-between gap-2">
                <Link
                  href="/profile/seoyeon.lee"
                  className="flex items-center gap-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 min-w-0"
                >
                  <Image
                    src="https://i.pravatar.cc/150?u=seoyeon.lee"
                    alt="이서연"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      이서연
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      @seoyeon.lee
                    </div>
                  </div>
                </Link>
                <button className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700 shrink-0">
                  팔로우
                </button>
              </li>
              <li className="flex items-center justify-between gap-2">
                <Link
                  href="/profile/jinho.park"
                  className="flex items-center gap-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 min-w-0"
                >
                  <Image
                    src="https://i.pravatar.cc/150?u=jinho.park"
                    alt="박진호"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      박진호
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      @jinho.park
                    </div>
                  </div>
                </Link>
                <button className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700 shrink-0">
                  팔로우
                </button>
              </li>
            </ul>
            <button className="w-full mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium text-center">
              더보기 →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
