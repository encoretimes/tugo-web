import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const RightSidebar = () => {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto p-4 text-black dark:text-white border-l border-neutral-200 dark:border-neutral-800">
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
        <input
          type="text"
          placeholder="검색"
          className="w-full rounded-full border-neutral-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 py-2 pl-10 pr-4"
        />
      </div>
      <div className="mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
        <h3 className="mb-2 text-lg font-bold">실시간 트렌드</h3>
        <ul className="space-y-2">
          <li>
            <div className="font-bold">#대한민국</div>
            <div className="text-xs text-gray-500 dark:text-neutral-400">123K posts</div>
          </li>
          <li>
            <div className="font-bold">#정치</div>
            <div className="text-xs text-gray-500 dark:text-neutral-400">45.6K posts</div>
          </li>
          <li>
            <div className="font-bold">#투표</div>
            <div className="text-xs text-gray-500 dark:text-neutral-400">7.8K posts</div>
          </li>
        </ul>
      </div>
      <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
        <h3 className="mb-2 text-lg font-bold">추천 팔로우</h3>
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-neutral-700"></div>
              <div>
                <div className="font-bold">사용자1</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">@user1</div>
              </div>
            </div>
            <button className="rounded-full bg-black dark:bg-white px-4 py-1 text-sm font-bold text-white dark:text-black">
              팔로우
            </button>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-neutral-700"></div>
              <div>
                <div className="font-bold">사용자2</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">@user2</div>
              </div>
            </div>
            <button className="rounded-full bg-black dark:bg-white px-4 py-1 text-sm font-bold text-white dark:text-black">
              팔로우
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
