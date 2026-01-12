import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/services/subscriptions';
import type { SubscriptionCreateRequest } from '@/types/user';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';

export const useSubscriptionStatus = (targetMemberId: number) => {
  return useQuery({
    queryKey: queryKeys.subscriptionStatus(targetMemberId),
    queryFn: () => subscriptionsApi.checkSubscriptionStatus(targetMemberId),
    enabled: !!targetMemberId,
  });
};

export const useSubscriberCount = (memberId: number) => {
  return useQuery({
    queryKey: queryKeys.subscriberCount(memberId),
    queryFn: () => subscriptionsApi.getSubscriberCount(memberId),
    enabled: !!memberId,
  });
};

export const useMySubscriptions = (page: number = 0) => {
  return useQuery({
    queryKey: [...queryKeys.mySubscriptions, page],
    queryFn: () => subscriptionsApi.getMySubscriptions(page, 20),
  });
};

export const useMemberSubscribers = (
  targetMemberId: number,
  page: number = 0
) => {
  return useQuery({
    queryKey: [...queryKeys.memberSubscribers(targetMemberId), page],
    queryFn: () =>
      subscriptionsApi.getMemberSubscribers(targetMemberId, page, 20),
    enabled: !!targetMemberId,
  });
};

export const useSubscribeMutation = () => {
  const queryClient = useQueryClient();

  const invalidateSubscriptionQueries = (targetMemberId: number) => {
    invalidationHelpers.onSubscriptionMutation(targetMemberId).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return useMutation({
    mutationFn: (request: SubscriptionCreateRequest) =>
      subscriptionsApi.createSubscription(request),
    onSuccess: (_, variables) => {
      invalidateSubscriptionQueries(variables.targetMemberId);
    },
  });
};

export const useUnsubscribeMutation = () => {
  const queryClient = useQueryClient();

  const invalidateSubscriptionQueries = (targetMemberId: number) => {
    invalidationHelpers.onSubscriptionMutation(targetMemberId).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return useMutation({
    mutationFn: ({
      subscriptionId,
    }: {
      subscriptionId: number;
      targetMemberId: number;
    }) => subscriptionsApi.cancelSubscription(subscriptionId),
    onSuccess: (_, variables) => {
      invalidateSubscriptionQueries(variables.targetMemberId);
    },
  });
};
