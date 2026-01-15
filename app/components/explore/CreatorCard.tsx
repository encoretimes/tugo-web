'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import { Creator } from '@/types/creator';
import { useUserStore } from '@/store/userStore';
import { useLoginPrompt } from '@/contexts/LoginPromptContext';
import {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useSubscriptionStatus,
} from '@/hooks/useSubscription';
import ConfirmModal from '@/components/modals/ConfirmModal';

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
  const { isAuthenticated, user } = useUserStore();
  const { requireLogin } = useLoginPrompt();
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

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
      requireLogin();
      return;
    }

    if (isOwnProfile) return;

    if (isSubscribed && subscriptionId) {
      // 구독 취소 확인 모달 표시
      setShowUnsubscribeModal(true);
    } else {
      subscribeMutation.mutate({ targetMemberId: creator.memberId });
    }
  };

  const handleUnsubscribeConfirm = () => {
    if (subscriptionId) {
      unsubscribeMutation.mutate(
        {
          subscriptionId,
          targetMemberId: creator.memberId,
        },
        {
          onSuccess: () => {
            setShowUnsubscribeModal(false);
          },
        }
      );
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
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isMutating ? '...' : isSubscribed ? '구독 중' : '구독'}
        </button>
      )}

      {/* 구독 취소 확인 모달 */}
      <ConfirmModal
        isOpen={showUnsubscribeModal}
        onClose={() => setShowUnsubscribeModal(false)}
        onConfirm={handleUnsubscribeConfirm}
        title="구독 취소"
        description={`${creator.nickname || creator.name}님의 구독을 취소하시겠습니까?`}
        confirmText="구독 취소"
        cancelText="유지하기"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
        isLoading={unsubscribeMutation.isPending}
      />
    </Link>
  );
};

export default CreatorCard;
