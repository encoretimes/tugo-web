'use client';

import { useDebates } from '@/hooks/useDebates';
import DebateCard from '@/components/feed/DebateCard';

const HotDebates = () => {
  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);

  return (
    <section className="relative bg-white">
      {/* 헤드라인 */}
      <div className="flex items-center justify-between px-0 py-4 lg:px-4">
        <h2 className="text-base font-bold text-gray-900">
          지금 가장 뜨거운 토론
        </h2>
      </div>

      {/* 토론 카드들 */}
      <div className="flex gap-3 overflow-x-auto px-0 pb-4 pt-2 scrollbar-hide lg:px-4">
        {isLoadingDebates ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[180px] w-[240px] shrink-0 animate-pulse rounded-xl bg-gray-50"
              />
            ))}
          </>
        ) : debates && debates.length > 0 ? (
          debates.map((post) => <DebateCard key={post.postId} post={post} />)
        ) : (
          <div className="w-full py-6 text-center">
            <div className="inline-flex flex-col items-center gap-2 text-gray-400">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm font-medium">아직 뜨거운 토론이 없습니다</p>
              <p className="text-xs">투표를 시작해서 첫 토론을 만들어보세요!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotDebates;
