import React from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const RightSidebar = () => {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto p-4 text-black border-l border-neutral-200">
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="검색"
          className="w-full rounded-full border-neutral-200 bg-gray-100 py-2 pl-10 pr-4 focus:border-primary-600 focus:ring-primary-600"
        />
      </div>
      <div className="mb-4 rounded-lg bg-neutral-100 p-4">
        <h3 className="mb-2 text-lg font-bold">실시간 트렌드</h3>
        <ul className="space-y-2">
          <li>
            <div className="font-bold">#대한민국</div>
            <div className="text-xs text-gray-500">123K posts</div>
          </li>
          <li>
            <div className="font-bold">#정치</div>
            <div className="text-xs text-gray-500">45.6K posts</div>
          </li>
          <li>
            <div className="font-bold">#투표</div>
            <div className="text-xs text-gray-500">7.8K posts</div>
          </li>
        </ul>
      </div>
      <div className="rounded-lg bg-neutral-100 p-4">
        <h3 className="mb-2 text-lg font-bold">추천 팔로우</h3>
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <Link href="/profile/minjun.kim" className="flex items-center space-x-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2">
              <img
                src="https://i.pravatar.cc/150?u=minjun.kim"
                alt="김민준"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-bold">김민준</div>
                <div className="text-sm text-gray-500">@minjun.kim</div>
              </div>
            </Link>
            <button className="rounded-full bg-primary-600 px-4 py-1 text-sm font-bold text-white hover:bg-primary-700">
              팔로우
            </button>
          </li>
          <li className="flex items-center justify-between">
            <Link href="/profile/seoyeon.lee" className="flex items-center space-x-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2">
              <img
                src="https://i.pravatar.cc/150?u=seoyeon.lee"
                alt="이서연"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-bold">이서연</div>
                <div className="text-sm text-gray-500">@seoyeon.lee</div>
              </div>
            </Link>
            <button className="rounded-full bg-primary-600 px-4 py-1 text-sm font-bold text-white hover:bg-primary-700">
              팔로우
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
