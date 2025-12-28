import { TrendingKeyword } from '@/types/search';
import { apiClient } from '@/lib/api-client';

/**
 * 실시간 검색어 조회
 */
export const getTrendingKeywords = async (
  limit = 10
): Promise<TrendingKeyword[]> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  return apiClient.get<TrendingKeyword[]>(
    `/api/v1/search/trending?${params.toString()}`
  );
};

/**
 * 검색어 기록 (검색 시 호출)
 */
export const recordSearch = async (keyword: string): Promise<void> => {
  return apiClient.post<void>('/api/v1/search/record', { keyword });
};
