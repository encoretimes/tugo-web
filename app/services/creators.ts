import { Creator, CreatorSortOption } from '@/types/creator';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

/**
 * 인기 크리에이터 목록 조회
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @param sort 정렬 옵션 (subscribers: 구독자 수, rising: 급상승)
 */
export const getPopularCreators = async (
  page = 0,
  size = 10,
  sort: CreatorSortOption = 'subscribers'
): Promise<PageResponse<Creator>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });

  return apiClient.get<PageResponse<Creator>>(
    `/api/v1/creators/popular?${params.toString()}`
  );
};
