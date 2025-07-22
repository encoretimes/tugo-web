export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    profileImageUrl: string | null;
  };
  content: string;
  createdAt: string;
  stats: {
    comments: number;
    reposts: number;
    likes: number;
  };
}
