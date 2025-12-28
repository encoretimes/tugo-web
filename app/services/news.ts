import { NewsArticle } from '@/types/news';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

/**
 * 뉴스 기사 목록 조회
 */
export const getNews = async (
  page = 0,
  size = 10
): Promise<PageResponse<NewsArticle>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiClient.get<PageResponse<NewsArticle>>(
    `/api/v1/news?${params.toString()}`
  );
};
