import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useSubscriptionStatus,
  useSubscriberCount,
  useSubscribeMutation,
  useUnsubscribeMutation,
} from '../useSubscription';

// Mock the subscriptions service
jest.mock('@/services/subscriptions', () => ({
  subscriptionsApi: {
    checkSubscriptionStatus: jest.fn(),
    getSubscriberCount: jest.fn(),
    getMySubscriptions: jest.fn(),
    getMemberSubscribers: jest.fn(),
    createSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
  },
}));

import { subscriptionsApi } from '@/services/subscriptions';

// Mock data
const mockSubscriptionStatus = {
  isSubscribed: false,
  subscriptionId: null,
};

const mockSubscriberCount = {
  memberId: 1,
  count: 100,
};

const mockSubscription = {
  id: 1,
  targetMemberId: 1,
  memberId: 999,
  subscriptionStatus: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// QueryClient wrapper 생성
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe('useSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSubscriptionStatus (구독 상태 조회)', () => {
    it('구독 상태를 성공적으로 조회해야 함', async () => {
      (subscriptionsApi.checkSubscriptionStatus as jest.Mock).mockResolvedValue(
        mockSubscriptionStatus
      );

      const { result } = renderHook(() => useSubscriptionStatus(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubscriptionStatus);
      expect(subscriptionsApi.checkSubscriptionStatus).toHaveBeenCalledWith(1);
    });

    it('구독 중인 상태를 올바르게 반환해야 함', async () => {
      (subscriptionsApi.checkSubscriptionStatus as jest.Mock).mockResolvedValue(
        {
          isSubscribed: true,
          subscriptionId: 123,
        }
      );

      const { result } = renderHook(() => useSubscriptionStatus(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.isSubscribed).toBe(true);
      expect(result.current.data?.subscriptionId).toBe(123);
    });

    it('targetMemberId가 0이면 쿼리가 실행되지 않아야 함', () => {
      const { result } = renderHook(() => useSubscriptionStatus(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(subscriptionsApi.checkSubscriptionStatus).not.toHaveBeenCalled();
    });
  });

  describe('useSubscriberCount (구독자 수 조회)', () => {
    it('구독자 수를 성공적으로 조회해야 함', async () => {
      (subscriptionsApi.getSubscriberCount as jest.Mock).mockResolvedValue(
        mockSubscriberCount
      );

      const { result } = renderHook(() => useSubscriberCount(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubscriberCount);
      expect(result.current.data?.count).toBe(100);
    });

    it('memberId가 0이면 쿼리가 실행되지 않아야 함', () => {
      const { result } = renderHook(() => useSubscriberCount(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(subscriptionsApi.getSubscriberCount).not.toHaveBeenCalled();
    });
  });

  describe('useSubscribeMutation (구독 생성)', () => {
    it('구독 생성이 성공해야 함', async () => {
      (subscriptionsApi.createSubscription as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const { result } = renderHook(() => useSubscribeMutation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ targetMemberId: 1 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(subscriptionsApi.createSubscription).toHaveBeenCalledWith({
        targetMemberId: 1,
      });
    });

    it('구독 생성 실패 시 에러 상태가 되어야 함', async () => {
      (subscriptionsApi.createSubscription as jest.Mock).mockRejectedValue(
        new Error('Subscription failed')
      );

      const { result } = renderHook(() => useSubscribeMutation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ targetMemberId: 1 });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUnsubscribeMutation (구독 취소)', () => {
    it('구독 취소가 성공해야 함', async () => {
      (subscriptionsApi.cancelSubscription as jest.Mock).mockResolvedValue(
        undefined
      );

      const { result } = renderHook(() => useUnsubscribeMutation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ subscriptionId: 1, targetMemberId: 1 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(subscriptionsApi.cancelSubscription).toHaveBeenCalledWith(1);
    });

    it('구독 취소 실패 시 에러 상태가 되어야 함', async () => {
      (subscriptionsApi.cancelSubscription as jest.Mock).mockRejectedValue(
        new Error('Unsubscribe failed')
      );

      const { result } = renderHook(() => useUnsubscribeMutation(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({ subscriptionId: 1, targetMemberId: 1 });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
