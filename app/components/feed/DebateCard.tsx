'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/types/post';
import { UserIcon } from '@heroicons/react/24/outline';

interface DebateCardProps {
  post: Post;
}

export default function DebateCard({ post }: DebateCardProps) {
  const router = useRouter();

  if (!post.poll) return null;

  const { poll, author } = post;
  const totalVotes = poll.totalVoters;

  const handleClick = () => {
    router.push(`/@${author.username}/post/${post.postId}`);
  };

  // 투표 가능한 경우 그라디언트 링 효과
  const hasGradientRing = !poll.hasVoted && !poll.isEnded;

  return (
    <div
      onClick={handleClick}
      className="shrink-0 cursor-pointer"
    >
      {/* 프로필 이미지 with 링 효과 */}
      <div className="flex flex-col items-center gap-2">
        <div className={`rounded-full p-0.5 ${hasGradientRing ? 'bg-gradient-to-tr from-primary-500 to-primary-300' : 'bg-gray-200'}`}>
          <div className="bg-white rounded-full p-1">
            {author.profileImageUrl ? (
              <Image
                src={author.profileImageUrl}
                alt={author.name}
                width={72}
                height={72}
                className="h-18 w-18 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-neutral-200">
                <UserIcon className="h-10 w-10 text-neutral-400" />
              </div>
            )}
          </div>
        </div>

        {/* 투표 주제 */}
        <p className="text-xs text-gray-600 text-center max-w-[90px] line-clamp-2 leading-tight">
          {poll.question}
        </p>
      </div>
    </div>
  );
}
