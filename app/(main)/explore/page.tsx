'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import VoteCard from '@/components/explore/VoteCard';
import CreatorCard from '@/components/explore/CreatorCard';
import NewsCard from '@/components/explore/NewsCard';
import { useDebates } from '@/hooks/useDebates';
import { usePopularCreators } from '@/hooks/useCreators';
import { useInfiniteNews } from '@/hooks/useNews';

type TabType = 'votes' | 'creators' | 'news';

const tabs: { id: TabType; label: string }[] = [
  { id: 'votes', label: '투표' },
  { id: 'creators', label: '크리에이터' },
  { id: 'news', label: '뉴스' },
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('votes');

  const { data: debates, isLoading: isLoadingDebates } = useDebates(20);
  const { data: creatorsData, isLoading: isLoadingCreators } =
    usePopularCreators(20);
  const { data: newsData, isLoading: isLoadingNews } = useInfiniteNews(20);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(
          `/explore/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
      }
    },
    [searchQuery, router]
  );

  // 뉴스 데이터 평탄화
  const allNews = newsData?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* 검색바 */}
      <div className="px-4 pt-4 pb-2">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="게시물, 크리에이터 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-100 rounded-[20px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </form>
      </div>

      {/* 탭 바 */}
      <div className="border-b border-neutral-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 투표 탭 */}
        {activeTab === 'votes' && (
          <div>
            {isLoadingDebates ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-neutral-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : debates && debates.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {debates.map((post, index) => (
                  <VoteCard key={post.postId} post={post} rank={index + 1} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500">
                진행 중인 투표가 없습니다
              </div>
            )}
          </div>
        )}

        {/* 크리에이터 탭 */}
        {activeTab === 'creators' && (
          <div>
            {isLoadingCreators ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-neutral-200 rounded-lg animate-pulse" />
                    <div className="w-11 h-11 bg-neutral-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : creatorsData && creatorsData.content.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {creatorsData.content.map((creator, index) => (
                  <CreatorCard
                    key={creator.memberId}
                    creator={creator}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500">
                아직 크리에이터가 없습니다
              </div>
            )}
          </div>
        )}

        {/* 뉴스 탭 */}
        {activeTab === 'news' && (
          <div>
            {isLoadingNews ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-full bg-neutral-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-3/4 bg-neutral-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allNews.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {allNews.map((article, index) => (
                  <NewsCard key={`${article.link}-${index}`} article={article} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500">
                뉴스를 불러오는 중입니다...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
