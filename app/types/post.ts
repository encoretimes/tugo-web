import { Poll } from './poll';

export type PostType = 'FREE' | 'SUBSCRIBER_ONLY' | 'PPV';

export interface Post {
  postId: number;
  author: {
    name: string;
    username: string;
    profileImageUrl: string | null;
  };
  contentText: string;
  postType: PostType;
  ppvPrice: number | null;
  createdAt: string;
  updatedAt: string;
  stats: {
    comments: number;
    likes: number;
  };
  mediaUrls?: string[];
  poll?: Poll;
  isLiked: boolean;
  isSaved: boolean;
}
