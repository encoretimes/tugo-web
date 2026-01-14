import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface MemberResponse {
  id: number;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  username: string | null;
}

interface CurrentUserData {
  member: MemberResponse;
}

const fetchCurrentUser = async (): Promise<CurrentUserData> => {
  const memberData = await apiClient.get<MemberResponse>('/api/v1/members/me');

  return {
    member: memberData,
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
