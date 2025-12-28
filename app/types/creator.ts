// Creator Types

export interface Creator {
  memberId: number;
  name: string;
  username: string;
  profileImageUrl: string | null;
  introduction: string | null;
  subscriberCount: number;
  postCount: number;
}

export type CreatorSortOption = 'subscribers' | 'rising';
