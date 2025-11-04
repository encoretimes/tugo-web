'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import PostComposer from './PostComposer';
import { useInfinitePosts } from '@/hooks/usePosts';
import { useScrollStore } from '@/store/scrollStore';
import PostSkeleton from './PostSkeleton';

const Feed = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts(activeTab === 'following');

  const { ref, inView } = useInView();
  const feedScrollPosition = useScrollStore((state) => state.feedScrollPosition);
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

  const TabButton = ({
    id,
    label,
    activeTab,
    onClick,
  }: {
    id: string;
    label: string;
    activeTab: string;
    onClick: (id: string) => void;
  }) => (
    <button
      className={`w-1/2 py-4 text-center font-bold transition-colors duration-200 hover:bg-neutral-100 ${
        activeTab === id
          ? 'border-b-2 border-primary-600 text-neutral-800 bg-white'
          : 'text-neutral-600 hover:text-neutral-800'
      }`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="border-r border-neutral-200">
      <PostComposer />
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="flex">
          <TabButton
            id="for-you"
            label="추천"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="following"
            label="구독"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>
      </div>
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
