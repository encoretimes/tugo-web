'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import { useInfinitePosts } from '@/hooks/usePosts';
import { useScrollStore } from '@/store/scrollStore';
import PostSkeleton from './PostSkeleton';
import InlinePostComposer from './InlinePostComposer';

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts(false); // 항상 전체 게시물 표시

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
      {/* 인라인 게시물 작성 영역 */}
      <InlinePostComposer />

      {/* 작성 영역과 게시물 사이 여백 + 구분선 */}
      <div className="h-4" />
      <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />

      <div>
        {isLoading ? (
          <div>
            <PostSkeleton />
            <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
            <PostSkeleton />
            <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
            <PostSkeleton />
            <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
            <PostSkeleton />
            <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
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
            {posts.map((post, index) => (
              <React.Fragment key={post.postId}>
                <Post post={post} />
                {index < posts.length - 1 && (
                  <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
                )}
              </React.Fragment>
            ))}
            {hasNextPage && (
              <div ref={ref} className="py-8">
                {isFetchingNextPage ? (
                  <div>
                    <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
                    <PostSkeleton />
                    <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
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
