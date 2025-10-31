import { apiClient } from '@/lib/api-client';
import type {
  Subscription,
  SubscriptionCreateRequest,
  SubscriptionStatusResponse,
  SubscriberCountResponse,
} from '@/types/subscription';

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
    creatorId: number
  ): Promise<SubscriptionStatusResponse> => {
    return apiClient.get<SubscriptionStatusResponse>(
      `/api/v1/subscriptions/check?creatorId=${creatorId}`
    );
  },

  // 구독자 수 조회
  getSubscriberCount: async (
    creatorId: number
  ): Promise<SubscriberCountResponse> => {
    return apiClient.get<SubscriberCountResponse>(
      `/api/v1/subscriptions/count?creatorId=${creatorId}`
    );
  },

  // 내 구독 목록 조회
  getMySubscriptions: async (page: number = 0, size: number = 20) => {
    // fanId는 서버에서 인증된 사용자로부터 자동 추출
    return apiClient.get<{
      content: Subscription[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(`/api/v1/subscriptions?page=${page}&size=${size}`);
  },

  // 크리에이터의 구독자 목록 조회
  getCreatorSubscribers: async (
    creatorId: number,
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
      `/api/v1/subscriptions?creatorId=${creatorId}&page=${page}&size=${size}`
    );
  },
};
