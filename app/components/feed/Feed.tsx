'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import { useInfinitePosts, FeedType } from '@/hooks/usePosts';
import { useScrollStore } from '@/store/scrollStore';
import { useUserStore } from '@/store/userStore';
import PostSkeleton from './PostSkeleton';
import InlinePostComposer from './InlinePostComposer';

const Feed = () => {
  const { isAuthenticated, hasHydrated } = useUserStore();
  const [feedType, setFeedType] = useState<FeedType>('recommended');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
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

  return (
    <div>
      <InlinePostComposer />

      <div className="h-4" />

      {/* 피드 타입 탭 */}
      {hasHydrated && isAuthenticated && (
        <div className="flex border-b border-gray-200 dark:border-neutral-700 mb-0">
          <button
            onClick={() => setFeedType('following')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              feedType === 'following'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
            }`}
          >
            구독
          </button>
          <button
            onClick={() => setFeedType('recommended')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              feedType === 'recommended'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
            }`}
          >
            추천
          </button>
        </div>
      )}

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
                <p className="font-medium mb-2">구독 중인 크리에이터가 없습니다</p>
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
                  <div className="divide-y divide-gray-100 dark:divide-neutral-800 border-t border-gray-100 dark:border-neutral-800">
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
