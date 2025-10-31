import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/api/subscriptions';
import type { SubscriptionCreateRequest } from '@/types/subscription';

// 구독 상태 조회
export const useSubscriptionStatus = (creatorId: number) => {
  return useQuery({
    queryKey: ['subscriptionStatus', creatorId],
    queryFn: () => subscriptionsApi.checkSubscriptionStatus(creatorId),
    enabled: !!creatorId,
  });
};

// 구독자 수 조회
export const useSubscriberCount = (creatorId: number) => {
  return useQuery({
    queryKey: ['subscriberCount', creatorId],
    queryFn: () => subscriptionsApi.getSubscriberCount(creatorId),
    enabled: !!creatorId,
  });
};

// 내 구독 목록 조회
export const useMySubscriptions = (page: number = 0) => {
  return useQuery({
    queryKey: ['mySubscriptions', page],
    queryFn: () => subscriptionsApi.getMySubscriptions(page, 20),
  });
};

// 크리에이터의 구독자 목록 조회
export const useCreatorSubscribers = (creatorId: number, page: number = 0) => {
  return useQuery({
    queryKey: ['creatorSubscribers', creatorId, page],
    queryFn: () => subscriptionsApi.getCreatorSubscribers(creatorId, page, 20),
    enabled: !!creatorId,
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
        queryKey: ['subscriptionStatus', variables.creatorId],
      });
      // 구독자 수 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriberCount', variables.creatorId],
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
      creatorId: number;
    }) => subscriptionsApi.cancelSubscription(subscriptionId),
    onSuccess: (_, variables) => {
      // 구독 상태 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriptionStatus', variables.creatorId],
      });
      // 구독자 수 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['subscriberCount', variables.creatorId],
      });
      // 내 구독 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};
