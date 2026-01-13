import { NewsArticle } from '@/types/news';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

/**
 * 뉴스 기사 목록 조회
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @param source 언론사 필터 (선택)
 */
export const getNews = async (
  page = 0,
  size = 10,
  source?: string
): Promise<PageResponse<NewsArticle>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (source) {
    params.append('source', source);
  }

  return apiClient.get<PageResponse<NewsArticle>>(
    `/api/v1/news?${params.toString()}`
  );
};

/**
 * 언론사 목록 조회
 */
export const getNewsSources = async (): Promise<string[]> => {
  return apiClient.get<string[]>('/api/v1/news/sources');
};
