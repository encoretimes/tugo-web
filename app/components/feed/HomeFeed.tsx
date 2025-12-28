'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import InlinePostComposer from './InlinePostComposer';
import RecommendedFeed from './RecommendedFeed';
import FollowingFeed from './FollowingFeed';

type FeedTab = 'recommended' | 'following';

const HomeFeed = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>('recommended');
  const { isAuthenticated, hasHydrated } = useUserStore();

  return (
    <div>
      <InlinePostComposer />

      {/* 탭 시스템 */}
      <div className="flex border-b border-neutral-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 py-4 text-center font-medium transition-colors relative ${
            activeTab === 'recommended'
              ? 'text-neutral-900'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          추천
          {activeTab === 'recommended' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
          )}
        </button>
        {hasHydrated && isAuthenticated && (
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${
              activeTab === 'following'
                ? 'text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            팔로잉
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        )}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="h-[8px] bg-[#F6F6F6] lg:-mx-6" />
      {activeTab === 'recommended' ? <RecommendedFeed /> : <FollowingFeed />}
    </div>
  );
};

export default HomeFeed;
