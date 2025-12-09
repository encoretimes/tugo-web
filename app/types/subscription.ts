export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
  id: number;
  targetMemberId: number;
  memberId: number;
  memberName?: string;
  memberUsername?: string;
  memberProfileImageUrl?: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCreateRequest {
  targetMemberId: number;
}

export interface SubscriptionStatusResponse {
  isSubscribed: boolean;
  subscriptionId: number | null;
}

export interface SubscriberCountResponse {
  memberId: number;
  count: number;
}
