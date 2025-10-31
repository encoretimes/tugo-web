import { apiClient } from '@/lib/api-client';
import { MemberSearchResult } from '@/types/mention';

/**
 * 사용자명으로 회원 검색
 * @param query - 검색할 사용자명 (부분 일치)
 * @returns 검색 결과 목록 (최대 10개)
 */
export const searchMembers = async (
  query: string
): Promise<MemberSearchResult[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }
  return apiClient.get<MemberSearchResult[]>(
    `/api/v1/members/search?query=${encodeURIComponent(query)}`
  );
};
