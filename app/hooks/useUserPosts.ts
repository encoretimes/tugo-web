import { useQuery } from '@tanstack/react-query';
import { UserPost } from '@/types/user';
import userPostsData from '@/data/userPosts.json';

const fetchUserPosts = async (username: string): Promise<UserPost[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const posts = (userPostsData as Record<string, UserPost[]>)[username] || [];
  return posts;
};

export const useUserPosts = (username: string) => {
  return useQuery({
    queryKey: ['userPosts', username],
    queryFn: () => fetchUserPosts(username),
    enabled: !!username,
  });
};
