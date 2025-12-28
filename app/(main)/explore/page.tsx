'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ExploreSection from '@/components/explore/ExploreSection';
import VoteCard from '@/components/explore/VoteCard';
import CreatorCard from '@/components/explore/CreatorCard';
import { useDebates } from '@/hooks/useDebates';
import { usePopularCreators } from '@/hooks/useCreators';

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);
  const { data: creatorsData, isLoading: isLoadingCreators } = usePopularCreators(5);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // TODO: 검색 페이지로 이동
        router.push(`/explore/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [searchQuery, router]
  );

  return (
    <div className="py-4">
      {/* 검색바 */}
      <form onSubmit={handleSearch} className="mb-6">
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

      {/* 섹션들 */}
      <div className="space-y-6">
        {/* Hot한 투표 섹션 */}
        <ExploreSection title="Hot한 투표" href="/explore/votes">
          {isLoadingDebates ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : debates && debates.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {debates.slice(0, 3).map((post, index) => (
                <VoteCard key={post.postId} post={post} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              진행 중인 투표가 없습니다
            </div>
          )}
        </ExploreSection>

        {/* 인기 크리에이터 섹션 */}
        <ExploreSection title="인기 크리에이터" href="/explore/creators">
          {isLoadingCreators ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
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
              {creatorsData.content.slice(0, 3).map((creator, index) => (
                <CreatorCard
                  key={creator.memberId}
                  creator={creator}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              아직 크리에이터가 없습니다
            </div>
          )}
        </ExploreSection>

        {/* 실시간 소식 섹션 - RSS 연동 후 활성화 */}
        {/* <ExploreSection title="실시간 소식" href="/explore/news">
          <div className="p-8 text-center text-neutral-500">
            뉴스 피드 준비 중입니다
          </div>
        </ExploreSection> */}
      </div>
    </div>
  );
}
