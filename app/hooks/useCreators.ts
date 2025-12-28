import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPopularCreators } from '@/services/creators';
import { CreatorSortOption } from '@/types/creator';
import { queryKeys } from '@/lib/query-keys';

/**
 * 인기 크리에이터 조회 Hook
 * @param limit 조회할 크리에이터 수
 * @param sort 정렬 옵션
 */
export const usePopularCreators = (
  limit = 5,
  sort: CreatorSortOption = 'subscribers'
) => {
  return useQuery({
    queryKey: [...queryKeys.creators, 'popular', sort, limit],
    queryFn: () => getPopularCreators(0, limit, sort),
  });
};

/**
 * 인기 크리에이터 무한 스크롤 Hook
 * @param sort 정렬 옵션
 * @param pageSize 페이지당 크리에이터 수
 */
export const useInfinitePopularCreators = (
  sort: CreatorSortOption = 'subscribers',
  pageSize = 10
) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.creators, 'popular', 'infinite', sort],
    queryFn: ({ pageParam = 0 }) => getPopularCreators(pageParam, pageSize, sort),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
