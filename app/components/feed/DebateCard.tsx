'use client';

import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';

interface DebateCardProps {
  post: Post;
}

export default function DebateCard({ post }: DebateCardProps) {
  const router = useRouter();

  if (!post.poll) return null;

  const { poll, author } = post;
  const totalVotes = poll.totalVoters;

  // 상위 2개 옵션만 표시
  const topOptions = [...poll.options]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 2);

  const getPercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const formatTimeRemaining = (endDate: string | undefined) => {
    if (!endDate) return '기한 없음';
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs < 0) return '종료됨';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}일 남음`;
    if (diffHours > 0) return `${diffHours}시간 남음`;
    return '곧 종료';
  };

  const handleClick = () => {
    router.push(`/@${author.username}/post/${post.postId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-72 shrink-0 bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 토론 주제 */}
      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
        {poll.question}
      </h3>

      {/* 참여 현황 */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <span>💬 {totalVotes.toLocaleString()}명 참여</span>
        <span>•</span>
        <span className={poll.isEnded ? 'text-red-600' : ''}>
          ⏱️ {formatTimeRemaining(poll.endDate)}
        </span>
      </div>

      {/* 상위 2개 옵션의 투표 결과 */}
      <div className="space-y-2">
        {topOptions.map((option) => {
          const percentage = getPercentage(option.voteCount);
          return (
            <div key={option.optionId}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-700 truncate flex-1 mr-2">
                  {option.optionText}
                </span>
                <span className="font-semibold text-primary-600 shrink-0">
                  {percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {poll.options.length > 2 && (
          <p className="text-xs text-gray-500 mt-1">
            +{poll.options.length - 2}개 옵션 더보기
          </p>
        )}
      </div>

      {/* 참여 버튼 */}
      {!poll.hasVoted && !poll.isEnded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full mt-3 py-2 text-xs font-medium text-primary-600 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          투표하기
        </button>
      )}
      {poll.hasVoted && !poll.isEnded && (
        <div className="w-full mt-3 py-2 text-xs font-medium text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          투표 완료
        </div>
      )}
    </div>
  );
}
