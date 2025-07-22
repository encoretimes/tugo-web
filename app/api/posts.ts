import { Post } from '@/types/post';
import posts from '@/data/posts.json';

export const getPosts = async (): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return posts as Post[];
};
