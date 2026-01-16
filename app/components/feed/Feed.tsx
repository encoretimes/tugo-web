'use client';

import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import Post from './Post';
import { useInfinitePosts, FeedType } from '@/hooks/usePosts';
import { useScrollStore } from '@/store/scrollStore';
import { useUserStore } from '@/store/userStore';
import PostSkeleton from './PostSkeleton';
import InlinePostComposer from './InlinePostComposer';
import FeedTabs from './FeedTabs';

const Feed = () => {
  const { isAuthenticated, hasHydrated } = useUserStore();
  const searchParams = useSearchParams();
  const feedType: FeedType =
    searchParams.get('tab') === 'following' ? 'following' : 'recommended';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useInfinitePosts(feedType);

  const { ref, inView } = useInView();
  const feedScrollPosition = useScrollStore(
    (state) => state.feedScrollPosition
  );
  const clearFeedScrollPosition = useScrollStore(
    (state) => state.clearFeedScrollPosition
  );

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data?.pages]
  );

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 위치 복원 (게시물 상세 페이지에서 뒤로왔을 때)
  useEffect(() => {
    if (feedScrollPosition > 0 && posts.length > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, feedScrollPosition);
        clearFeedScrollPosition();
      });
    }
  }, [feedScrollPosition, posts.length, clearFeedScrollPosition]);

  // Pull-to-refresh 이벤트 핸들러
  useEffect(() => {
    const handlePullToRefresh = () => {
      refetch();
    };

    window.addEventListener('pulltorefresh', handlePullToRefresh);
    return () => {
      window.removeEventListener('pulltorefresh', handlePullToRefresh);
    };
  }, [refetch]);

  return (
    <div>
      {/* PC 전용 피드 타입 탭 - 모바일에서는 layout에서 별도 렌더링 */}
      {hasHydrated && isAuthenticated && (
        <FeedTabs className="sticky top-0 z-10 -mx-6 hidden px-6 lg:block" />
      )}

      {/* Pull-to-refresh 인디케이터 */}
      {isRefetching && (
        <div className="flex items-center justify-center py-3 text-sm text-gray-500 dark:text-neutral-400">
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          새로고침 중...
        </div>
      )}

      <InlinePostComposer />

      <div>
        {isLoading ? (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <h3 className="text-lg font-bold">오류 발생</h3>
            <p>
              게시물을 불러오는 중 오류가 발생했습니다. 잠시 후 다시
              시도해주세요.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
            {feedType === 'following' ? (
              <div>
                <p className="mb-2 font-medium">
                  구독 중인 크리에이터가 없습니다
                </p>
                <p className="text-sm">
                  크리에이터를 구독하고 새로운 게시물을 받아보세요
                </p>
              </div>
            ) : (
              '추천 게시물이 없습니다'
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {posts.map((post) => (
                <Post key={post.postId} post={post} />
              ))}
            </div>
            {hasNextPage && (
              <div ref={ref} className="py-8">
                {isFetchingNextPage ? (
                  <div className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-neutral-800 dark:border-neutral-800">
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
    </div>
  );
};

export default Feed;
