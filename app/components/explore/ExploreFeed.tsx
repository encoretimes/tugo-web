'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from '@/components/feed/Post';
import PostSkeleton from '@/components/feed/PostSkeleton';
import { useInfinitePosts } from '@/hooks/usePosts';

const ExploreFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts(false);

  const { ref, inView } = useInView();
  const posts = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h3 className="text-lg font-bold">오류 발생</h3>
        <p>
          게시물을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">게시물이 없습니다</div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default ExploreFeed;
