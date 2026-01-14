import { apiClient } from '@/lib/api-client';

export interface ProfileUpdateRequest {
  nickname?: string; // 표시용 이름 (name 대신 이것을 수정)
  introduction?: string;
  profileUrl?: string;
  bannerImageUrl?: string;
}

/**
 * 현재 사용자의 프로필 업데이트
 * @param profile - 업데이트할 프로필 정보
 */
export const updateMyProfile = async (
  profile: ProfileUpdateRequest
): Promise<void> => {
  return apiClient.put<void>('/api/v1/profiles/me', profile);
};
