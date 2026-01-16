'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type FeedType = 'following' | 'recommended';

interface FeedTabsProps {
  className?: string;
}

const FeedTabs = ({ className = '' }: FeedTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab =
    searchParams.get('tab') === 'following' ? 'following' : 'recommended';

  const handleTabChange = useCallback(
    (tab: FeedType) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'recommended') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : '/', { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className={`bg-white dark:bg-neutral-950 ${className}`}>
      <div className="flex border-b border-gray-200 dark:border-neutral-700">
        <button
          onClick={() => handleTabChange('following')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            currentTab === 'following'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
          }`}
        >
          구독
        </button>
        <button
          onClick={() => handleTabChange('recommended')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            currentTab === 'recommended'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
          }`}
        >
          추천
        </button>
      </div>
    </div>
  );
};

export default FeedTabs;
