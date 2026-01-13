'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/solid';
import { Creator } from '@/types/creator';
import { useUserStore } from '@/store/userStore';
import {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useSubscriptionStatus,
} from '@/hooks/useSubscription';

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
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();

  const { data: subscriptionStatus, isLoading: isStatusLoading } =
    useSubscriptionStatus(creator.memberId);
  const subscribeMutation = useSubscribeMutation();
  const unsubscribeMutation = useUnsubscribeMutation();

  const isSubscribed = subscriptionStatus?.isSubscribed ?? false;
  const subscriptionId = subscriptionStatus?.subscriptionId ?? null;
  const isOwnProfile = user?.id === creator.memberId;
  const isMutating =
    subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleSubscribeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isOwnProfile) return;

    if (isSubscribed && subscriptionId) {
      unsubscribeMutation.mutate({
        subscriptionId,
        targetMemberId: creator.memberId,
      });
    } else {
      subscribeMutation.mutate({ targetMemberId: creator.memberId });
    }
  };

  return (
    <Link
      href={`/@${creator.username}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
    >
      {rank && (
        <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary-600">
          {rank}
        </span>
      )}
      {creator.profileImageUrl ? (
        <Image
          src={creator.profileImageUrl}
          alt={creator.name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0">
          <UserIcon className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
            {creator.name}
          </span>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 truncate">
          @{creator.username}
        </div>
        {showStats && (
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              구독자 {creator.subscriberCount.toLocaleString()}명
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              게시물 {creator.postCount.toLocaleString()}개
            </span>
          </div>
        )}
      </div>
      {!isOwnProfile && (
        <button
          onClick={handleSubscribeClick}
          disabled={isMutating || isStatusLoading}
          className={`shrink-0 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 ${
            isSubscribed
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isMutating ? '...' : isSubscribed ? '구독중' : '구독'}
        </button>
      )}
    </Link>
  );
};

export default CreatorCard;
