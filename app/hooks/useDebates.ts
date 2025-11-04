import { useQuery } from '@tanstack/react-query';
import { getPostsPage } from '@/api/posts';
import { Post } from '@/types/post';

/**
 * 활발한 토론(설문조사가 있는 게시물) 조회 훅
 * - Poll이 있는 게시물만 필터링
 * - 참여자 수가 많은 순으로 정렬
 * - 종료되지 않은 토론 우선
 */
export function useDebates(limit: number = 5) {
  return useQuery({
    queryKey: ['debates', limit],
    queryFn: async () => {
      // 전체 게시물 조회 (최대 50개)
      const response = await getPostsPage(0, 50);

      // Poll이 있는 게시물만 필터링
      const debatePosts = response.content.filter(
        (post: Post) => post.poll !== undefined && post.poll !== null
      );

      // 정렬: 종료되지 않은 것 우선, 그 다음 참여자 수 순
      const sortedDebates = debatePosts.sort((a: Post, b: Post) => {
        // 종료 여부 우선
        if (a.poll!.isEnded !== b.poll!.isEnded) {
          return a.poll!.isEnded ? 1 : -1;
        }
        // 참여자 수로 정렬
        return b.poll!.totalVoters - a.poll!.totalVoters;
      });

      // 상위 limit개만 반환
      return sortedDebates.slice(0, limit);
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}
