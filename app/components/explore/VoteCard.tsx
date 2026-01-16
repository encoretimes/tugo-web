'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { ChartBarIcon } from '@heroicons/react/24/solid';

interface VoteCardProps {
  post: Post;
  rank?: number;
}

const VoteCard: React.FC<VoteCardProps> = ({ post, rank }) => {
  const defaultProfileImage = `https://i.pravatar.cc/150?u=${post.author.username}`;
  const poll = post.poll;

  if (!poll) return null;

  // 투표 마감 시간 계산
  const getTimeRemaining = () => {
    if (poll.isEnded) return '마감됨';
    if (!poll.endDate) return '진행 중';

    const now = new Date();
    const endDate = new Date(poll.endDate);
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) return '마감됨';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}일 남음`;
    if (diffHours > 0) return `${diffHours}시간 남음`;
    return '곧 마감';
  };

  return (
    <Link
      href={`/@${post.author.username}/post/${post.postId}`}
      className="block px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
    >
      <div className="flex items-start gap-3">
        {rank && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-600 text-xs font-bold text-white">
            {rank}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Image
              src={post.author.profileImageUrl || defaultProfileImage}
              alt={post.author.nickname || post.author.name}
              width={20}
              height={20}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {post.author.nickname || post.author.name}
            </span>
            <span className="text-sm text-neutral-400">·</span>
            <span className="text-sm text-neutral-400">
              {getTimeRemaining()}
            </span>
          </div>
          <p className="mb-2 line-clamp-2 text-sm text-neutral-800 dark:text-neutral-200">
            {poll.question || post.contentText}
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" />
              <span>{poll.totalVoters.toLocaleString()}명 참여</span>
            </div>
            <span>{poll.options.length}개 선택지</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VoteCard;
