'use client';

import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './Post';
import { useInfiniteFollowingPosts } from '@/hooks/usePosts';
import PostSkeleton from './PostSkeleton';
import Link from 'next/link';

const FollowingFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteFollowingPosts();

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
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">👀</div>
        <p className="text-lg font-medium text-neutral-800 mb-2">
          아직 팔로잉하는 크리에이터가 없습니다
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          관심있는 크리에이터를 구독하면 이곳에서 새 게시물을 확인할 수 있습니다
        </p>
        <Link
          href="/explore/creators"
          className="inline-block px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
        >
          크리에이터 탐색하기
        </Link>
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

export default FollowingFeed;
