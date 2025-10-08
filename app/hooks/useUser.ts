import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';
import { apiClient } from '@/lib/api-client';

const fetchUser = async (username: string): Promise<User | null> => {
  try {
    const user = await apiClient.get<User>(`/api/v1/profiles/${username}`);
    return user;
  } catch (error) {
    console.error(`Failed to fetch user ${username}:`, error);
    return null;
  }
};

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
  });
};
