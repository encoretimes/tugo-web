import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrendingKeywords, recordSearch } from '@/services/search';
import { queryKeys } from '@/lib/query-keys';

/**
 * 실시간 검색어 조회 Hook
 */
export const useTrendingKeywords = (limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.trending, limit],
    queryFn: () => getTrendingKeywords(limit),
    staleTime: 60 * 1000, // 1분
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
  });
};

/**
 * 검색어 기록 Mutation Hook
 */
export const useRecordSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordSearch,
    onSuccess: () => {
      // 검색어 순위 업데이트를 위해 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.trending });
    },
  });
};
