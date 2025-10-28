'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import PostComposer from './PostComposer';
import { useInfinitePosts } from '@/hooks/usePosts';
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
  } = useInfinitePosts();

  const { ref, inView } = useInView();

  const posts = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
            label="팔로잉"
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
            {!hasNextPage && posts.length > 0 && (
              <div className="py-8 text-center text-neutral-500">
                모든 게시물을 불러왔습니다
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
