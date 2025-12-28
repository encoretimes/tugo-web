/**
 * TanStack Query의 queryKey를 중앙에서 관리하는 파일
 *
 * 장점:
 * - 타입 안정성 확보
 * - 오타 방지
 * - 캐시 무효화 시 일관성 보장
 * - 리팩토링 용이
 */

export const queryKeys = {
  // 사용자 관련
  currentUser: ['currentUser'] as const,
  user: (username: string) => ['user', username] as const,

  // 게시물 관련
  posts: ['posts'] as const,
  post: (postId: number) => ['post', postId] as const,

  // 투표(토론) 관련
  debates: ['debates'] as const,

  // 크리에이터 관련
  creators: ['creators'] as const,

  // 뉴스 관련
  news: ['news'] as const,

  // 실시간 검색어 관련
  trending: ['trending'] as const,

  // 북마크 관련
  bookmarks: (page?: number, size?: number) =>
    ['bookmarks', page, size] as const,

  // 댓글 관련
  comments: (postId: number) => ['comments', postId] as const,

  // 좋아요 관련 (필요시 추가)
  likes: (postId: number) => ['likes', postId] as const,

  // 알림 관련
  notifications: ['notifications'] as const,

  // 정당 관련
  parties: ['parties'] as const,

  // 포인트 관련
  points: ['points'] as const,

  // 메시지 관련
  messages: ['messages'] as const,
  conversations: ['conversations'] as const,
  conversation: (conversationId: number) =>
    ['conversation', conversationId] as const,

  // 구독 관련
  subscriptionStatus: (targetMemberId: number) =>
    ['subscriptionStatus', targetMemberId] as const,
  subscriberCount: (memberId: number) => ['subscriberCount', memberId] as const,
  mySubscriptions: ['mySubscriptions'] as const,
  memberSubscribers: (targetMemberId: number) =>
    ['memberSubscribers', targetMemberId] as const,
} as const;

/**
 * 캐시 무효화 헬퍼 함수들
 */
export const invalidationHelpers = {
  /**
   * 게시물 생성/수정/삭제 시 무효화할 쿼리들
   */
  onPostMutation: () => [
    queryKeys.posts,
    queryKeys.bookmarks(),
    // 필요시 특정 사용자의 프로필 포스트도 무효화
  ],

  /**
   * 북마크 토글 시 무효화할 쿼리들
   */
  onBookmarkToggle: () => [queryKeys.posts, queryKeys.bookmarks()],

  /**
   * 좋아요 토글 시 무효화할 쿼리들
   */
  onLikeToggle: (postId: number) => [queryKeys.posts, queryKeys.post(postId)],

  /**
   * 댓글 추가/삭제 시 무효화할 쿼리들
   */
  onCommentMutation: (postId: number) => [
    queryKeys.comments(postId),
    queryKeys.posts,
    queryKeys.post(postId),
  ],
} as const;
