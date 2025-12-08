'use client';

import { useDebates } from '@/hooks/useDebates';
import DebateCard from '@/components/feed/DebateCard';

const HotDebates = () => {
  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);

  return (
    <section className="relative bg-white">
      {/* 헤드라인 */}
      <div className="flex items-center justify-between px-0 lg:px-4 py-4">
        <h2 className="font-bold text-gray-900 text-base">
          지금 가장 뜨거운 토론
        </h2>
      </div>

      {/* 토론 카드들 */}
      <div className="flex gap-3 px-0 lg:px-4 pt-2 pb-4 overflow-x-auto scrollbar-hide">
        {isLoadingDebates ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[240px] h-[180px] rounded-xl bg-gray-50 animate-pulse"
              />
            ))}
          </>
        ) : debates && debates.length > 0 ? (
          debates.map((post) => <DebateCard key={post.postId} post={post} />)
        ) : (
          <div className="w-full py-6 text-center">
            <div className="inline-flex flex-col items-center gap-2 text-gray-400">
              <svg
                className="w-10 h-10"
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
