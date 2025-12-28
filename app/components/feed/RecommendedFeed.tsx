'use client';

import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import { useInfiniteRecommendedPosts } from '@/hooks/usePosts';
import PostSkeleton from './PostSkeleton';

const RecommendedFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteRecommendedPosts();

  const { ref, inView } = useInView();

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data?.pages]
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
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
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">아직 추천할 게시물이 없습니다</p>
        <p className="text-sm mt-2">새로운 게시물이 올라오면 이곳에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default RecommendedFeed;
