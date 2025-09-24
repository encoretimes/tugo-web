import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';
import usersData from '@/data/users.json';

const fetchUser = async (username: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = usersData.find((u) => u.username === username);
  return user || null;
};

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
  });
};
