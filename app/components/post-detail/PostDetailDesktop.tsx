'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Post as PostType } from '@/types/post';
import PostDetailContent from './PostDetailContent';

interface PostDetailDesktopProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

export default function PostDetailDesktop({
  post,
  isLoading,
  error,
  onClose,
}: PostDetailDesktopProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      {/* Close Button - 화면 우측 상단 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed right-6 top-6 z-[60] transition-opacity hover:opacity-80"
        aria-label="닫기"
      >
        <XMarkIcon className="h-8 w-8 text-white" strokeWidth={2.5} />
      </button>

      <div
        className="animate-in zoom-in-95 slide-in-from-bottom-4 relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl duration-200 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
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
