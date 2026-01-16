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
    <aside className="h-full bg-white p-4 text-black dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto max-w-xs pt-4">
        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="게시물, 크리에이터 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-lg border-0 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>
        </div>

        {/* 실시간 인기 투표 */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between">
            <Link
              href="/explore?tab=votes"
              className="flex items-center gap-1 transition-opacity hover:opacity-70"
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
                    className="h-8 animate-pulse rounded bg-gray-50 dark:bg-neutral-800"
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
                          className="flex items-center gap-3 rounded-md py-2 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <span className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200">
                            {post.poll?.question ||
                              post.contentText.slice(0, 30)}
                          </span>
                          <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                            {post.poll?.totalVoters.toLocaleString()}명
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 py-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm font-medium text-gray-400">
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
        <div className="mb-6 h-px bg-gray-200 dark:bg-neutral-800" />

        {/* 인기 크리에이터 */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <Link
              href="/explore?tab=creators"
              className="flex items-center gap-1 transition-opacity hover:opacity-70"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                인기 크리에이터
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            </Link>
          </div>
          <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">
            지금 가장 주목받는 크리에이터들이에요!
          </p>
          <ul className="space-y-3">
            {isLoadingCreators ? (
              [1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-100 dark:bg-neutral-800" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-neutral-800" />
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-100 dark:bg-neutral-800" />
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
                    className="-m-2 flex min-w-0 flex-1 items-center gap-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    {creator.profileImageUrl ? (
                      <Image
                        src={creator.profileImageUrl}
                        alt={creator.nickname || creator.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <UserIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {creator.nickname || creator.name}
                      </div>
                      <div className="truncate text-xs text-gray-500 dark:text-gray-400">
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
                      className="shrink-0 rounded-md bg-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
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
                      className="shrink-0 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                    >
                      구독
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
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
