'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from '@/components/feed/Post';
import PostSkeleton from '@/components/feed/PostSkeleton';
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

const ExploreDebates = () => {
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
    <div>
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
      {isLoading ? (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <h3 className="text-lg font-bold">오류 발생</h3>
          <p>투표 게시물을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
          투표가 있는 게시물이 없습니다
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
          {hasNextPage && (
            <div ref={ref} className="py-8">
              {isFetchingNextPage ? (
                <div>
                  <PostSkeleton />
                  <PostSkeleton />
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
  );
};

export default ExploreDebates;
