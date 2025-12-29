'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useDebates } from '@/hooks/useDebates';
import { usePopularCreators } from '@/hooks/useCreators';

const RightSidebar = () => {
  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);
  const { data: creatorsData, isLoading: isLoadingCreators } =
    usePopularCreators(3);

  return (
    <aside className="h-full p-4 text-black">
      <div className="max-w-xs mx-auto pt-4">
        {/* 실시간 인기 투표 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <Link
              href="/explore?tab=votes"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <h3 className="text-base font-bold text-gray-900">
                실시간 인기 투표
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-900" />
            </Link>
            <span className="text-xs text-gray-400">오늘 23시 30분 기준</span>
          </div>
          <div className="py-2">
            {isLoadingDebates ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-50 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-1">
                {[0, 1, 2, 3, 4].map((index) => {
                  const post = debates?.[index];
                  return (
                    <li key={index}>
                      {post ? (
                        <Link
                          href={`/${post.author.username}/post/${post.postId}`}
                          className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{
                              background:
                                'linear-gradient(135deg, #6956E3 0%, #8B7BE8 100%)',
                            }}
                          >
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm text-gray-800 truncate">
                            {post.poll?.question ||
                              post.contentText.slice(0, 30)}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {post.poll?.totalVoters.toLocaleString()}명
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 py-2">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{
                              background:
                                'linear-gradient(135deg, #6956E3 0%, #8B7BE8 100%)',
                            }}
                          >
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm text-gray-400 font-medium">
                            —
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* 인기 크리에이터 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Link
              href="/explore?tab=creators"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <h3 className="text-base font-bold text-gray-900">
                인기 크리에이터
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-900" />
            </Link>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            지금 가장 주목받는 크리에이터들이에요!
          </p>
          <ul className="space-y-3">
            {isLoadingCreators ? (
              [1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-1" />
                    <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                  </div>
                </li>
              ))
            ) : creatorsData && creatorsData.content.length > 0 ? (
              creatorsData.content.map((creator) => (
                <li
                  key={creator.memberId}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/@${creator.username}`}
                    className="flex items-center gap-2 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 min-w-0"
                  >
                    <Image
                      src={
                        creator.profileImageUrl ||
                        `https://i.pravatar.cc/150?u=${creator.username}`
                      }
                      alt={creator.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-gray-900 truncate">
                        {creator.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        @{creator.username}
                      </div>
                    </div>
                  </Link>
                  <button className="rounded-full bg-[#6956E3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5a48c9] shrink-0">
                    구독
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400 text-center py-4">
                아직 크리에이터가 없습니다
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
