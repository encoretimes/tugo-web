import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getDebatesPage, DebateSortOption } from '@/api/posts';
import { Post } from '@/types/post';
import { PageResponse } from '@/types/pagination';
import { queryKeys } from '@/lib/query-keys';

/**
 * 활발한 토론(투표가 있는 게시물) 조회 훅
 * - 백엔드에서 투표가 있는 게시물만 반환
 * @param limit 가져올 개수
 * @param sort 정렬 옵션 (popular: 참여자수, latest: 최신, ending: 마감임박)
 */
export function useDebates(limit: number = 5, sort: DebateSortOption = 'popular') {
  return useQuery({
    queryKey: [...queryKeys.debates, limit, sort],
    queryFn: async () => {
      const response = await getDebatesPage(0, limit, sort);
      return response.content;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

/**
 * 무한 스크롤 투표 게시물 조회 Hook
 * @param sort 정렬 옵션 (popular: 참여자수, latest: 최신, ending: 마감임박)
 * @param pageSize 페이지당 게시물 수
 */
export function useInfiniteDebates(sort: DebateSortOption = 'popular', pageSize = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.debates, 'infinite', sort],
    queryFn: ({ pageParam = 0 }) => getDebatesPage(pageParam, pageSize, sort),
    getNextPageParam: (lastPage: PageResponse<Post>) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
}
