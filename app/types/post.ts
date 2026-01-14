// Post Types
export type PostType = 'FREE' | 'SUBSCRIBER_ONLY' | 'PPV';

export interface Post {
  postId: number;
  author: {
    name: string;
    nickname?: string;
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

// Comment Types
export interface Comment {
  id: number;
  author: {
    name: string;
    nickname?: string;
    username: string;
    profileImageUrl: string | null;
  };
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
}

// Poll Types
export type PollType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface PollOption {
  optionId: number;
  optionText: string;
  optionOrder: number;
  voteCount: number;
  isSelectedByMe: boolean;
}

export interface Poll {
  pollId: number;
  question?: string;
  pollType: PollType;
  endDate?: string;
  isEnded: boolean;
  options: PollOption[];
  totalVoters: number;
  hasVoted: boolean;
}

export interface PollCreateData {
  question?: string;
  pollType: PollType;
  endDate?: string;
  options: string[];
}

export interface VoteRequest {
  optionIds: number[];
}

// Mention Types
export interface MemberSearchResult {
  memberId: number;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
}

export interface Mention {
  id: number;
  mentionedMemberId: number;
  postId: number | null;
  commentId: number | null;
  createdAt: string;
}
