'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Creator } from '@/types/creator';

interface CreatorCardProps {
  creator: Creator;
  rank?: number;
  showStats?: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  rank,
  showStats = true,
}) => {
  const defaultProfileImage = `https://i.pravatar.cc/150?u=${creator.username}`;

  return (
    <Link
      href={`/@${creator.username}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
    >
      {rank && (
        <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary-600">
          {rank}
        </span>
      )}
      <Image
        src={creator.profileImageUrl || defaultProfileImage}
        alt={creator.name}
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-neutral-900 truncate">
            {creator.name}
          </span>
        </div>
        <div className="text-sm text-neutral-500 truncate">
          @{creator.username}
        </div>
        {showStats && (
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-neutral-400">
              구독자 {creator.subscriberCount.toLocaleString()}명
            </span>
            <span className="text-xs text-neutral-400">
              게시물 {creator.postCount.toLocaleString()}개
            </span>
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // TODO: 구독 처리
        }}
        className="shrink-0 px-4 py-1.5 rounded-md bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
      >
        구독
      </button>
    </Link>
  );
};

export default CreatorCard;
