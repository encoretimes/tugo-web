import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface MemberResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  hasCreator: boolean;
  creatorId: number | null;
  username: string | null;
}

interface CreatorResponse {
  id: number;
  introduction: string;
  bannerImageUrl: string;
  profileUrl: string;
  username: string;
  currentBalance: number;
  isActive: boolean;
}

interface CurrentUserData {
  member: MemberResponse;
  creator: CreatorResponse | null;
}

const fetchCurrentUser = async (): Promise<CurrentUserData> => {
  const memberData = await apiClient.get<MemberResponse>('/api/v1/members/me');

  let creatorData: CreatorResponse | null = null;

  if (memberData.hasCreator && memberData.creatorId) {
    try {
      creatorData = await apiClient.get<CreatorResponse>('/api/v1/creators/me');
    } catch (error) {
      console.error('Failed to fetch creator data:', error);
    }
  }

  return {
    member: memberData,
    creator: creatorData,
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 가비지 컬렉션 방지
    retry: 1,
  });
};
