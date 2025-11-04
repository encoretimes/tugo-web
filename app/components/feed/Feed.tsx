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
      {!isLoadingDebates && debates && debates.length > 0 && (
        <section className="border-gray-200 bg-white">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">열띤 토론</h2>
          </div>
          {/* 가로 스크롤 영역 */}
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-4 px-4">
              {debates.map((post) => (
                <DebateCard key={post.postId} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
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
