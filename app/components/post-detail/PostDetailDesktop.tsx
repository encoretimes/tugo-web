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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-8 mx-4 bg-white rounded-xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 left-0 z-10 m-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="닫기"
        >
          <XMarkIcon className="h-6 w-6 text-gray-900" />
        </button>

        {/* Content */}
        <div className="mt-[-56px]">
          <PostDetailContent
            post={post}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
