export interface MemberSearchResult {
  memberId: number;
  username: string;
  name: string;
  profileImageUrl: string | null;
}

export interface Mention {
  id: number;
  mentionedMemberId: number;
  postId: number | null;
  commentId: number | null;
  createdAt: string;
}
