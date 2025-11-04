'use client';

import { Post as PostType } from '@/types/post';
import Post from '@/app/components/feed/Post';

interface PostDetailContentProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

export default function PostDetailContent({
  post,
  isLoading,
  error,
  onClose,
}: PostDetailContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-red-600 font-medium mb-2">
          게시물을 불러올 수 없습니다
        </p>
        <p className="text-sm text-gray-500 text-center">
          {error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다'}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          닫기
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 mb-4">게시물을 찾을 수 없습니다</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          닫기
        </button>
      </div>
    );
  }

  return <Post post={post} disableNavigation={true} />;
}
