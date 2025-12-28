'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import VoteCard from '@/components/explore/VoteCard';
import { useInfiniteDebates } from '@/hooks/useDebates';
import { DebateSortOption } from '@/services/posts';

type SortOption = {
  id: DebateSortOption;
  label: string;
};

const sortOptions: SortOption[] = [
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
  { id: 'ending', label: '마감임박' },
];

export default function ExploreVotesPage() {
  const [sortBy, setSortBy] = useState<DebateSortOption>('popular');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteDebates(sortBy);

  const { ref, inView } = useInView();
  const posts = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="py-4">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/explore"
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">Hot한 투표</h1>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-6">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === option.id
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <h3 className="text-lg font-bold">오류 발생</h3>
            <p>투표 게시물을 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            진행 중인 투표가 없습니다
          </div>
        ) : (
          <>
            <div className="divide-y divide-neutral-100">
              {posts.map((post, index) => (
                <VoteCard key={post.postId} post={post} rank={index + 1} />
              ))}
            </div>
            {hasNextPage && (
              <div ref={ref} className="py-8">
                {isFetchingNextPage ? (
                  <div className="space-y-4 px-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
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
