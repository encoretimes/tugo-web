'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CreatorCard from '@/components/explore/CreatorCard';
import { useInfinitePopularCreators } from '@/hooks/useCreators';
import { CreatorSortOption } from '@/types/creator';

type SortOption = {
  id: CreatorSortOption;
  label: string;
};

const sortOptions: SortOption[] = [
  { id: 'subscribers', label: '구독자 순' },
  { id: 'rising', label: '급상승' },
];

export default function ExploreCreatorsPage() {
  const [sortBy, setSortBy] = useState<CreatorSortOption>('subscribers');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePopularCreators(sortBy);

  const { ref, inView } = useInView();
  const creators = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="py-4">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/explore"
          className="-ml-2 rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeftIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          인기 크리에이터
        </h1>
      </div>

      {/* 정렬 버튼 */}
      <div className="mb-6 flex gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              sortBy === option.id
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                  <div className="flex-1">
                    <div className="mb-1 h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-3 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <h3 className="text-lg font-bold">오류 발생</h3>
            <p>크리에이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            아직 크리에이터가 없습니다
          </div>
        ) : (
          <>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {creators.map((creator, index) => (
                <CreatorCard
                  key={creator.memberId}
                  creator={creator}
                  rank={index + 1}
                />
              ))}
            </div>
            {hasNextPage && (
              <div ref={ref} className="py-8">
                {isFetchingNextPage ? (
                  <div className="space-y-4 px-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                        <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div className="flex-1">
                          <div className="mb-1 h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                          <div className="h-3 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-neutral-500">
                    스크롤하여 더 보기
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
