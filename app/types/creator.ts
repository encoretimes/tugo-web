// Creator Types

export interface Creator {
  memberId: number;
  name: string;
  nickname?: string;
  username: string;
  profileImageUrl: string | null;
  introduction: string | null;
  subscriberCount: number;
  postCount: number;
}

export type CreatorSortOption = 'subscribers' | 'rising';
