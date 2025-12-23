import { apiClient } from '@/lib/api-client';
import type {
  Subscription,
  SubscriptionCreateRequest,
  SubscriptionStatusResponse,
  SubscriberCountResponse,
} from '@/types/user';

export const subscriptionsApi = {
  // 구독 생성
  createSubscription: async (
    request: SubscriptionCreateRequest
  ): Promise<Subscription> => {
    return apiClient.post<Subscription>('/api/v1/subscriptions', request);
  },

  // 구독 취소
  cancelSubscription: async (subscriptionId: number): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/subscriptions/${subscriptionId}`);
  },

  // 구독 상태 확인
  checkSubscriptionStatus: async (
    targetMemberId: number
  ): Promise<SubscriptionStatusResponse> => {
    return apiClient.get<SubscriptionStatusResponse>(
      `/api/v1/subscriptions/check?targetMemberId=${targetMemberId}`
    );
  },

  // 구독자 수 조회
  getSubscriberCount: async (
    memberId: number
  ): Promise<SubscriberCountResponse> => {
    return apiClient.get<SubscriberCountResponse>(
      `/api/v1/subscriptions/count?memberId=${memberId}`
    );
  },

  // 내 구독 목록 조회
  getMySubscriptions: async (page: number = 0, size: number = 20) => {
    return apiClient.get<{
      content: Subscription[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(`/api/v1/subscriptions?page=${page}&size=${size}`);
  },

  // 회원의 구독자 목록 조회
  getMemberSubscribers: async (
    targetMemberId: number,
    page: number = 0,
    size: number = 20
  ) => {
    return apiClient.get<{
      content: Subscription[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(
      `/api/v1/subscriptions?targetMemberId=${targetMemberId}&page=${page}&size=${size}`
    );
  },
};
