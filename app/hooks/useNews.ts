import { useInfiniteQuery } from '@tanstack/react-query';
import { getNews } from '@/services/news';
import { queryKeys } from '@/lib/query-keys';

/**
 * 뉴스 기사 무한 스크롤 조회 Hook
 */
export const useInfiniteNews = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: queryKeys.news,
    queryFn: ({ pageParam = 0 }) => getNews(pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
