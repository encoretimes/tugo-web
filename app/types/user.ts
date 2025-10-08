import { Post } from '@/types/post';

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
  isCreator?: boolean;
  creatorId?: number | null;
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
