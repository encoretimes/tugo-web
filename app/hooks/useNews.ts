import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getNews, getCategories, getNewsSources } from '@/services/news';
import { queryKeys } from '@/lib/query-keys';

/**
 * 뉴스 기사 무한 스크롤 조회 Hook
 * @param pageSize 페이지 크기
 * @param category 카테고리 (politics, economy, society)
 * @param source 언론사 필터 (선택, 정치 카테고리에서만 지원)
 */
export const useInfiniteNews = (
  pageSize = 10,
  category = 'politics',
  source?: string
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.news(category, source),
    queryFn: ({ pageParam = 0 }) => getNews(pageParam, pageSize, category, source),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 카테고리 목록 조회 Hook
 */
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.newsCategories,
    queryFn: getCategories,
    staleTime: 24 * 60 * 60 * 1000, // 24시간 (거의 변경되지 않음)
  });
};

/**
 * 언론사 목록 조회 Hook (정치 카테고리용)
 */
export const useNewsSources = () => {
  return useQuery({
    queryKey: queryKeys.newsSources,
    queryFn: getNewsSources,
    staleTime: 24 * 60 * 60 * 1000, // 24시간 (거의 변경되지 않음)
  });
};
