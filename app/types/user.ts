import { Post } from './post';

// User Types
export interface User {
  id: string;
  name: string;
  username: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  bio: string;
  location?: string;
  website?: string;
  joinedDate: string;
  isVerified: boolean;
  stats: {
    posts: number;
    media: number;
    followers: number;
    following: number;
    bookmarks: number;
  };
  isFollowing?: boolean;
  isSubscribed?: boolean;
  posts?: Post[];
}

export interface UserPost {
  id: string;
  content: string;
  createdAt: string;
  mediaUrls?: string[];
  stats: {
    comments: number;
    reposts: number;
    likes: number;
  };
}

// Subscription Types
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
