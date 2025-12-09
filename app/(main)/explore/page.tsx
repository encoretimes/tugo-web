'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';
import ExploreFeed from '@/components/explore/ExploreFeed';
import ExploreDebates from '@/components/explore/ExploreDebates';

type TabType = 'all' | 'debates';

const tabs = [
  { id: 'all' as TabType, label: '전체' },
  { id: 'debates' as TabType, label: '투표' },
];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = (searchParams.get('tab') as TabType) || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = useCallback(
    (tab: TabType) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // 검색 기능은 향후 구현
        console.log('Search:', searchQuery);
      }
    },
    [searchQuery]
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'all':
        return <ExploreFeed />;
      case 'debates':
        return <ExploreDebates />;
      default:
        return <ExploreFeed />;
    }
  };

  return (
    <div className="py-4">
      {/* 검색바 */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="게시물, 회원 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-100 rounded-[20px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </form>

      {/* 탭 */}
      <div className="flex border-b border-neutral-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              currentTab === tab.id
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.label}
            {currentTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent()}
    </div>
  );
}
