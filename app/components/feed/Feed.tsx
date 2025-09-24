'use client';

import React, { useState } from 'react';
import Post from './Post';
import PostComposer from './PostComposer';
import { usePosts } from '@/hooks/usePosts';
import PostSkeleton from './PostSkeleton';

const Feed = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const { data: posts, isLoading, error } = usePosts();

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
          posts?.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
