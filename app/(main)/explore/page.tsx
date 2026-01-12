'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import VoteCard from '@/components/explore/VoteCard';
import CreatorCard from '@/components/explore/CreatorCard';
import NewsCard from '@/components/explore/NewsCard';
import { useDebates } from '@/hooks/useDebates';
import { usePopularCreators } from '@/hooks/useCreators';
import { useInfiniteNews } from '@/hooks/useNews';
import { useTrendingKeywords } from '@/hooks/useSearch';

type TabType = 'news' | 'creators' | 'votes';

const tabs: { id: TabType; label: string }[] = [
  { id: 'news', label: '실시간 뉴스' },
  { id: 'creators', label: '추천 크리에이터' },
  { id: 'votes', label: '인기 투표' },
];

const SEARCH_HISTORY_KEY = 'tugo_search_history';
const MAX_SEARCH_HISTORY = 10;

/**
 * 검색 기록 관리 (로컬스토리지)
 * TODO: 백엔드 기반 검색 기록 구현 필요
 * - 사용자별 검색 기록 저장/조회 API
 * - 검색 기록 삭제 API
 * - 검색어 자동완성 API
 */
const getSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

const addSearchHistory = (query: string) => {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory();
  const filtered = history.filter((h) => h !== query);
  const updated = [query, ...filtered].slice(0, MAX_SEARCH_HISTORY);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

const removeSearchHistory = (query: string) => {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory();
  const updated = history.filter((h) => h !== query);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

const clearSearchHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as TabType | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // 실제 적용된 검색어
  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromUrl && ['news', 'creators', 'votes'].includes(tabFromUrl) ? tabFromUrl : 'news'
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: debates, isLoading: isLoadingDebates } = useDebates(20);
  const { data: creatorsData, isLoading: isLoadingCreators } =
    usePopularCreators(20);
  const { data: newsData, isLoading: isLoadingNews } = useInfiniteNews(20);
  const { data: trendingKeywords } = useTrendingKeywords(10);

  // URL의 tab 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    if (tabFromUrl && ['news', 'creators', 'votes'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // 검색 기록 로드
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const query = searchQuery.trim();
      if (query) {
        addSearchHistory(query);
        setSearchHistory(getSearchHistory());
        setActiveSearch(query);
      } else {
        setActiveSearch('');
      }
      setShowDropdown(false);
    },
    [searchQuery]
  );

  const handleSelectKeyword = (keyword: string) => {
    setSearchQuery(keyword);
    addSearchHistory(keyword);
    setSearchHistory(getSearchHistory());
    setActiveSearch(keyword);
    setShowDropdown(false);
  };

  const handleRemoveHistory = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeSearchHistory(query);
    setSearchHistory(getSearchHistory());
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    searchInputRef.current?.focus();
  };

  // 뉴스 데이터 평탄화
  const allNews = newsData?.pages.flatMap((page) => page.content) ?? [];

  // 검색 필터링
  const filteredDebates = activeSearch
    ? debates?.filter(
        (post) =>
          post.contentText?.toLowerCase().includes(activeSearch.toLowerCase()) ||
          post.poll?.question?.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : debates;

  const filteredCreators = activeSearch
    ? creatorsData?.content.filter(
        (creator) =>
          creator.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
          creator.username.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : creatorsData?.content;

  const filteredNews = activeSearch
    ? allNews.filter(
        (article) =>
          article.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
          article.description?.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : allNews;

  return (
    <div className="flex flex-col h-full">
      {/* 검색바 */}
      <div className="px-4 pt-4 pb-2 relative">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`${tabs.find((t) => t.id === activeTab)?.label} 검색...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowDropdown(false);
                  searchInputRef.current?.blur();
                }
              }}
              className="w-full pl-12 pr-10 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-[20px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
            {(searchQuery || activeSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
              >
                <XMarkIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              </button>
            )}
          </div>
        </form>

        {/* 검색 드롭다운 */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-4 right-4 top-full mt-1 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 max-h-80 overflow-y-auto"
          >
            {/* 최근 검색어 */}
            {searchHistory.length > 0 && (
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    최근 검색어
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((query) => (
                    <div
                      key={query}
                      onClick={() => handleSelectKeyword(query)}
                      className="flex items-center justify-between py-2 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{query}</span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveHistory(e, query)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-all"
                      >
                        <XMarkIcon className="h-3 w-3 text-neutral-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 실시간 검색어 */}
            {trendingKeywords && trendingKeywords.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1 mb-2">
                  <FireIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    실시간 검색어
                  </span>
                </div>
                <div className="space-y-1">
                  {trendingKeywords.map((item, index) => (
                    <div
                      key={item.keyword}
                      onClick={() => handleSelectKeyword(item.keyword)}
                      className="flex items-center gap-3 py-2 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                    >
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{
                          background:
                            index < 3
                              ? 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)'
                              : '#9CA3AF',
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {item.keyword}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchHistory.length === 0 &&
              (!trendingKeywords || trendingKeywords.length === 0) && (
                <div className="p-6 text-center text-neutral-400 text-sm">
                  검색어를 입력해주세요
                </div>
              )}
          </div>
        )}
      </div>

      {/* 검색 결과 표시 */}
      {activeSearch && (
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-sm text-neutral-600">
            &quot;{activeSearch}&quot; 검색 결과
          </span>
        </div>
      )}

      {/* 탭 바 */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-900 dark:bg-neutral-100 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 뉴스 탭 */}
        {activeTab === 'news' && (
          <div>
            {isLoadingNews ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {filteredNews.map((article, index) => (
                  <NewsCard key={`${article.link}-${index}`} article={article} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                {activeSearch
                  ? `"${activeSearch}"에 대한 뉴스가 없습니다`
                  : '뉴스를 불러오는 중입니다...'}
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
                    <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                    <div className="w-11 h-11 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCreators && filteredCreators.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {filteredCreators.map((creator, index) => (
                  <CreatorCard
                    key={creator.memberId}
                    creator={creator}
                    rank={activeSearch ? undefined : index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                {activeSearch
                  ? `"${activeSearch}"에 대한 크리에이터가 없습니다`
                  : '아직 크리에이터가 없습니다'}
              </div>
            )}
          </div>
        )}

        {/* 투표 탭 */}
        {activeTab === 'votes' && (
          <div>
            {isLoadingDebates ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : filteredDebates && filteredDebates.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {filteredDebates.map((post, index) => (
                  <VoteCard
                    key={post.postId}
                    post={post}
                    rank={activeSearch ? undefined : index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                {activeSearch
                  ? `"${activeSearch}"에 대한 투표가 없습니다`
                  : '진행 중인 투표가 없습니다'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
