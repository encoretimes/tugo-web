'use client';

import React from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import Post from '@/components/feed/Post';
import PostSkeleton from '@/components/feed/PostSkeleton';

export default function BookmarksPage() {
  const { data, isLoading, error, refetch } = useBookmarks(0, 20);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            보관함
          </h1>
        </div>
        <div>
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            보관함
          </h1>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600 dark:text-neutral-400">
            보관함을 불러오는데 실패했습니다.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-md bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const posts = data?.content || [];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
          보관함
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {data?.totalElements || 0}개의 게시물
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600 dark:text-neutral-400">
            보관한 게시물이 없습니다.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
            게시물의 보관함 아이콘을 눌러 저장하세요.
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <Post
              key={post.postId}
              post={post}
              onPostDeleted={() => refetch()}
              onPostUpdated={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
