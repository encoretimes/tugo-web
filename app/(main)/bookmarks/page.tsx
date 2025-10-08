'use client';

import React from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import Post from '@/components/feed/Post';
import PostSkeleton from '@/components/feed/PostSkeleton';

export default function BookmarksPage() {
  const { data, isLoading, error, refetch } = useBookmarks(0, 20);

  if (isLoading) {
    return (
      <div className="border-l border-r min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <h1 className="text-xl font-bold">보관함</h1>
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
      <div className="border-l border-r min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <h1 className="text-xl font-bold">보관함</h1>
        </div>
        <div className="p-8 text-center">
          <p className="text-neutral-600">보관함을 불러오는데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const posts = data?.content || [];

  return (
    <div className="border-l border-r min-h-screen">
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <h1 className="text-xl font-bold">보관함</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {data?.totalElements || 0}개의 게시물
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-neutral-600">
            보관한 게시물이 없습니다.
          </p>
          <p className="text-sm text-neutral-500 mt-2">
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
