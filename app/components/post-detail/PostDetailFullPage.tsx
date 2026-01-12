'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Post as PostType } from '@/types/post';
import PostDetailContent from './PostDetailContent';

interface PostDetailFullPageProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onBack: () => void;
}

export default function PostDetailFullPage({
  post,
  isLoading,
  error,
  onBack,
}: PostDetailFullPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 animate-in fade-in duration-150">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-white dark:bg-neutral-950 px-4 py-3 border-b border-transparent dark:border-neutral-800">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-900 dark:text-neutral-100" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">게시물</h1>
      </div>

      {/* Content */}
      <div>
        <PostDetailContent
          post={post}
          isLoading={isLoading}
          error={error}
          onClose={onBack}
        />
      </div>
    </div>
  );
}
