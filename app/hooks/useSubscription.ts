import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/api/subscriptions';
import type { SubscriptionCreateRequest } from '@/types/subscription';

// 구독 상태 조회
export const useSubscriptionStatus = (targetMemberId: number) => {
  return useQuery({
    queryKey: ['subscriptionStatus', targetMemberId],
    queryFn: () => subscriptionsApi.checkSubscriptionStatus(targetMemberId),
    enabled: !!targetMemberId,
  });
};

// 구독자 수 조회
export const useSubscriberCount = (memberId: number) => {
  return useQuery({
    queryKey: ['subscriberCount', memberId],
    queryFn: () => subscriptionsApi.getSubscriberCount(memberId),
    enabled: !!memberId,
  });
};

// 내 구독 목록 조회
export const useMySubscriptions = (page: number = 0) => {
  return useQuery({
    queryKey: ['mySubscriptions', page],
    queryFn: () => subscriptionsApi.getMySubscriptions(page, 20),
  });
};

// 회원의 구독자 목록 조회
export const useMemberSubscribers = (
  targetMemberId: number,
  page: number = 0
) => {
  return useQuery({
    queryKey: ['memberSubscribers', targetMemberId, page],
    queryFn: () =>
      subscriptionsApi.getMemberSubscribers(targetMemberId, page, 20),
    enabled: !!targetMemberId,
  });
};

// 구독 생성 mutation
export const useSubscribeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubscriptionCreateRequest) =>
      subscriptionsApi.createSubscription(request),
    onSuccess: (_, variables) => {
      // 구독 상태 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriptionStatus', variables.targetMemberId],
      });
      // 구독자 수 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriberCount', variables.targetMemberId],
      });
      // 내 구독 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};

// 구독 취소 mutation
export const useUnsubscribeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
    }: {
      subscriptionId: number;
      targetMemberId: number;
    }) => subscriptionsApi.cancelSubscription(subscriptionId),
    onSuccess: (_, variables) => {
      // 구독 상태 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriptionStatus', variables.targetMemberId],
      });
      // 구독자 수 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriberCount', variables.targetMemberId],
      });
      // 내 구독 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};
