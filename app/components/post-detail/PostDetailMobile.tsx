'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Post as PostType } from '@/types/post';
import PostDetailContent from './PostDetailContent';

interface PostDetailMobileProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

export default function PostDetailMobile({
  post,
  isLoading,
  error,
  onClose,
}: PostDetailMobileProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-white dark:bg-neutral-950 px-4 py-3 border-b border-transparent dark:border-neutral-800">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-900 dark:text-neutral-100" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">게시물</h1>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-57px)] overflow-y-auto">
        <PostDetailContent
          post={post}
          isLoading={isLoading}
          error={error}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
