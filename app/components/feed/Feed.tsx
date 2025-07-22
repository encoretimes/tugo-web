'use client';

import React, { useState } from 'react';
import Post from './Post';
import PostComposer from './PostComposer';
import { usePosts } from '@/hooks/usePosts';
import PostSkeleton from './PostSkeleton';

const Feed = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const { data: posts, isLoading, error } = usePosts();

  return (
    <div>
      <PostComposer />
      <div className="border-b">
        <div className="flex">
          <button
            className={`w-1/2 py-4 text-center font-bold ${
              activeTab === 'for-you' ? 'border-b-2 border-red-500' : ''
            }`}
            onClick={() => setActiveTab('for-you')}
          >
            추천
          </button>
          <button
            className={`w-1/2 py-4 text-center font-bold ${
              activeTab === 'following' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('following')}
          >
            팔로잉
          </button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            게시물을 불러오는 중 오류가 발생했습니다.
          </div>
        ) : (
          posts?.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
