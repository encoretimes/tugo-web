'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRightIcon, UserIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebates } from '@/hooks/useDebates';
import { usePopularCreators } from '@/hooks/useCreators';
import {
  useSubscribeMutation,
  useUnsubscribeMutation,
} from '@/hooks/useSubscription';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToastStore } from '@/store/toastStore';
import { queryKeys } from '@/lib/query-keys';
import ConfirmModal from '@/components/modals/ConfirmModal';

const RightSidebar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const [subscriptions, setSubscriptions] = useState<Map<number, number>>(
    new Map()
  );
  const [unsubscribeTarget, setUnsubscribeTarget] = useState<{
    memberId: number;
    subscriptionId: number;
    displayName: string;
  } | null>(null);
  const { data: debates, isLoading: isLoadingDebates } = useDebates(5);
  const { data: creatorsData, isLoading: isLoadingCreators } =
    usePopularCreators(3);
  const subscribeMutation = useSubscribeMutation();
  const unsubscribeMutation = useUnsubscribeMutation();
  const { checkAuth } = useRequireAuth();
  const { addToast } = useToastStore();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubscribe = (memberId: number, displayName: string) => {
    if (!checkAuth()) return;

    // Optimistic update
    setSubscriptions((prev) => new Map(prev).set(memberId, -1)); // -1은 임시 값

    subscribeMutation.mutate(
      { targetMemberId: memberId },
      {
        onSuccess: (data) => {
          setSubscriptions((prev) => new Map(prev).set(memberId, data.id));
          addToast(`${displayName}님을 구독했습니다!`, 'success');
          queryClient.invalidateQueries({
            queryKey: queryKeys.subscriptionStatus(memberId),
          });
        },
        onError: () => {
          setSubscriptions((prev) => {
            const newMap = new Map(prev);
            newMap.delete(memberId);
            return newMap;
          });
          addToast('구독에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      }
    );
  };

  const handleUnsubscribeClick = (
    memberId: number,
    subscriptionId: number,
    displayName: string
  ) => {
    setUnsubscribeTarget({ memberId, subscriptionId, displayName });
  };

  const handleUnsubscribeConfirm = () => {
    if (!unsubscribeTarget) return;

    const { memberId, subscriptionId, displayName } = unsubscribeTarget;

    unsubscribeMutation.mutate(
      { subscriptionId, targetMemberId: memberId },
      {
        onSuccess: () => {
          setSubscriptions((prev) => {
            const newMap = new Map(prev);
            newMap.delete(memberId);
            return newMap;
          });
          addToast(`${displayName}님 구독을 취소했습니다.`, 'success');
          queryClient.invalidateQueries({
            queryKey: queryKeys.subscriptionStatus(memberId),
          });
          setUnsubscribeTarget(null);
        },
        onError: () => {
          addToast('구독 취소에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      }
    );
  };

  return (
    <aside className="h-full p-4 text-black dark:text-neutral-50 bg-white dark:bg-neutral-950">
      <div className="max-w-xs mx-auto pt-4">
        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="게시물, 크리에이터 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-neutral-800 border-0 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
            />
          </div>
        </div>

        {/* 실시간 인기 투표 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <Link
              href="/explore?tab=votes"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                실시간 인기 투표
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            </Link>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              오늘 23시 30분 기준
            </span>
          </div>
          <div className="py-2">
            {isLoadingDebates ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-50 dark:bg-neutral-800 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-1">
                {[0, 1, 2, 3, 4].map((index) => {
                  const post = debates?.[index];
                  return (
                    <li key={index}>
                      {post ? (
                        <Link
                          href={`/@${post.author.username}/post/${post.postId}`}
                          className="flex items-center gap-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                        >
                          <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary-600">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">
                            {post.poll?.question ||
                              post.contentText.slice(0, 30)}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                            {post.poll?.totalVoters.toLocaleString()}명
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 py-2">
                          <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary-600">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm text-gray-400 font-medium">
                            —
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-gray-200 dark:bg-neutral-800 mb-6" />

        {/* 인기 크리에이터 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Link
              href="/explore?tab=creators"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                인기 크리에이터
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            지금 가장 주목받는 크리에이터들이에요!
          </p>
          <ul className="space-y-3">
            {isLoadingCreators ? (
              [1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-20 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse mb-1" />
                    <div className="h-3 w-16 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />
                  </div>
                </li>
              ))
            ) : creatorsData && creatorsData.content.length > 0 ? (
              creatorsData.content.map((creator) => (
                <li
                  key={creator.memberId}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/@${creator.username}`}
                    className="flex items-center gap-2 flex-1 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md p-2 -m-2 min-w-0"
                  >
                    {creator.profileImageUrl ? (
                      <Image
                        src={creator.profileImageUrl}
                        alt={creator.nickname || creator.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0">
                        <UserIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {creator.nickname || creator.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{creator.username}
                      </div>
                    </div>
                  </Link>
                  {subscriptions.has(creator.memberId) ? (
                    <button
                      onClick={() =>
                        handleUnsubscribeClick(
                          creator.memberId,
                          subscriptions.get(creator.memberId) || 0,
                          creator.nickname || creator.name
                        )
                      }
                      className="rounded-md bg-neutral-200 dark:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 shrink-0 transition-colors"
                    >
                      구독 중
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleSubscribe(
                          creator.memberId,
                          creator.nickname || creator.name
                        )
                      }
                      disabled={subscribeMutation.isPending}
                      className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50 shrink-0 transition-colors"
                    >
                      구독
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                아직 크리에이터가 없습니다
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 구독 취소 확인 모달 */}
      <ConfirmModal
        isOpen={!!unsubscribeTarget}
        onClose={() => setUnsubscribeTarget(null)}
        onConfirm={handleUnsubscribeConfirm}
        title="구독 취소"
        description={`${unsubscribeTarget?.displayName}님의 구독을 취소하시겠습니까?`}
        confirmText="구독 취소"
        cancelText="유지하기"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
        isLoading={unsubscribeMutation.isPending}
      />
    </aside>
  );
};

export default RightSidebar;
