import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';

/**
 * URL/라우트 파라미터에서 순수 username 추출
 * - URL 디코딩 (%40 -> @)
 * - @ 접두사 제거 (@username -> username)
 */
const normalizeUsername = (username: string): string => {
  const decoded = decodeURIComponent(username);
  return decoded.startsWith('@') ? decoded.slice(1) : decoded;
};

const fetchUser = async (username: string): Promise<User | null> => {
  const cleanUsername = normalizeUsername(username);
  try {
    return await apiClient.get<User>(`/api/v1/profiles/${cleanUsername}`);
  } catch (error) {
    console.error(`Failed to fetch user ${cleanUsername}:`, error);
    return null;
  }
};

export const useUser = (username: string) => {
  const cleanUsername = normalizeUsername(username);
  return useQuery({
    queryKey: ['user', cleanUsername],
    queryFn: () => fetchUser(username),
    enabled: !!cleanUsername,
  });
};
