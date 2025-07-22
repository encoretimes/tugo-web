export interface Party {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  bannerImageUrl: string;
  isJoined?: boolean;
}
