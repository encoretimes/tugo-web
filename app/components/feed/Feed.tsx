'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import DebateCard from './DebateCard';
import { useInfinitePosts } from '@/hooks/usePosts';
import { useDebates } from '@/hooks/useDebates';
import { useScrollStore } from '@/store/scrollStore';
import PostSkeleton from './PostSkeleton';

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts(false); // 항상 전체 게시물 표시

  // 활발한 토론 데이터
  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);

  const { ref, inView } = useInView();
  const feedScrollPosition = useScrollStore(
    (state) => state.feedScrollPosition
  );
  const clearFeedScrollPosition = useScrollStore(
    (state) => state.clearFeedScrollPosition
  );

  const posts = data?.pages.flatMap((page) => page.content) ?? [];

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 위치 복원 (게시물 상세 페이지에서 뒤로왔을 때)
  useEffect(() => {
    if (feedScrollPosition > 0 && posts.length > 0) {
      // 약간의 지연을 두고 스크롤 복원 (DOM 렌더링 완료 대기)
      setTimeout(() => {
        window.scrollTo(0, feedScrollPosition);
        clearFeedScrollPosition();
      }, 100);
    }
  }, [feedScrollPosition, posts.length, clearFeedScrollPosition]);

  return (
    <div>
      {/* 열띤 토론 섹션 */}
      <section className="relative border-b border-gray-200 bg-white mb-2 z-10">
        <div className="px-4 py-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            🔥 열띤 토론
          </h2>
        </div>
        {/* 가로 스크롤 영역 */}
        <div className="overflow-x-auto scrollbar-hide pb-6">
          <div className="flex gap-3 px-4 pt-2">
            {isLoadingDebates ? (
              // 로딩 스켈레톤
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[240px] h-[200px] rounded-xl bg-gray-100 animate-pulse"
                  />
                ))}
              </>
            ) : debates && debates.length > 0 ? (
              // 토론 카드들
              debates.map((post) => (
                <DebateCard key={post.postId} post={post} />
              ))
            ) : (
              // 빈 상태
              <div className="w-full py-8 text-center">
                <div className="inline-flex flex-col items-center gap-2 text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    아직 열띤 토론이 없습니다
                  </p>
                  <p className="text-xs">
                    투표를 시작해서 첫 토론을 만들어보세요!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <div>
        {isLoading ? (
          <div>
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
          <div className="p-8 text-center text-gray-500">게시물이 없습니다</div>
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
    </div>
  );
};

export default Feed;
