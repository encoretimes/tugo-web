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
    <div className="animate-in fade-in min-h-screen bg-white duration-150 dark:bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-transparent bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-900 dark:text-neutral-100" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
          게시물
        </h1>
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
