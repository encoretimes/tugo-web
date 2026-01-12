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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={onClose}
    >
      {/* Close Button - 화면 우측 상단 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-6 right-6 z-[60] transition-opacity hover:opacity-80"
        aria-label="닫기"
      >
        <XMarkIcon className="h-8 w-8 text-white" strokeWidth={2.5} />
      </button>

      <div
        className="relative w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-hidden"
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
