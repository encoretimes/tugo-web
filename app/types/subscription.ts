export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
  id: number;
  creatorId: number;
  fanId: number;
  fanName?: string;
  fanUsername?: string;
  fanProfileImageUrl?: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCreateRequest {
  creatorId: number;
}

export interface SubscriptionStatusResponse {
  isSubscribed: boolean;
  subscriptionId: number | null;
}

export interface SubscriberCountResponse {
  creatorId: number;
  count: number;
}
