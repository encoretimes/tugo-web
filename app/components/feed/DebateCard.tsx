'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/types/post';
import {
  UserIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

interface DebateCardProps {
  post: Post;
}

export default function DebateCard({ post }: DebateCardProps) {
  const router = useRouter();

  if (!post.poll) return null;

  const { poll, author, stats } = post;

  const handleClick = () => {
    router.push(`/@${author.username}/post/${post.postId}`);
  };

  // 투표 가능 여부
  const canVote = !poll.hasVoted && !poll.isEnded;

  // 총 투표 수 계산
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.voteCount,
    0
  );

  return (
    <div
      onClick={handleClick}
      className={`
        group relative shrink-0 w-[240px] rounded-xl border-2
        transition-all duration-200 cursor-pointer z-20
        ${canVote ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white hover:shadow-lg hover:scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}
      `}
    >
      {/* 투표 가능 배지 */}
      {canVote && (
        <div className="absolute -top-2 -right-2 z-30">
          <div className="flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            <FireIcon className="w-3.5 h-3.5" />
            투표하기
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2">
          {author.profileImageUrl ? (
            <Image
              src={author.profileImageUrl}
              alt={author.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex w-8 h-8 items-center justify-center rounded-full bg-neutral-200">
              <UserIcon className="w-4 h-4 text-neutral-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {author.name}
              </p>
              {author.isCreator && (
                <CheckBadgeIcon className="w-4 h-4 text-primary-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">@{author.username}</p>
          </div>
        </div>

        {/* 투표 주제 */}
        <div className="min-h-[60px]">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-3 leading-snug">
            {poll.question}
          </h3>
        </div>

        {/* 통계 정보 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span className="font-medium">{stats.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <FireIcon className="w-4 h-4" />
              <span className="font-medium">{totalVotes}표</span>
            </div>
          </div>
          {poll.hasVoted && (
            <div className="text-xs font-semibold text-primary-600 flex items-center gap-1">
              <CheckBadgeIcon className="w-4 h-4" />
              참여완료
            </div>
          )}
          {poll.isEnded && (
            <div className="text-xs font-semibold text-gray-500">투표종료</div>
          )}
        </div>
      </div>
    </div>
  );
}
