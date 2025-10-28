export interface Comment {
  id: number;
  author: {
    name: string;
    username: string;
    profileImageUrl: string | null;
  };
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
}
