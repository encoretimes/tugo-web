'use client';

import {
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
  HeartIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';

interface PostActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  likeCount: number;
  commentCount: number;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onCommentToggle: () => void;
  onMenuClick: () => void;
}

export default function PostActions({
  isLiked,
  isSaved,
  likeCount,
  commentCount,
  onLikeToggle,
  onBookmarkToggle,
  onCommentToggle,
  onMenuClick,
}: PostActionsProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button
          onClick={onLikeToggle}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
            isLiked
              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
              : 'text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/30'
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{likeCount}</span>
        </button>
        <button
          onClick={onCommentToggle}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-primary-900/30"
        >
          <ChatBubbleOvalLeftIcon className="h-5 w-5" />
          <span className="text-sm">{commentCount}</span>
        </button>
        <button
          onClick={onBookmarkToggle}
          className={`flex items-center rounded-full p-1.5 transition-colors ${
            isSaved
              ? 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30'
              : 'text-neutral-500 hover:bg-primary-50 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-primary-900/30'
          }`}
        >
          {isSaved ? (
            <BookmarkIconSolid className="h-5 w-5" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <button
        onClick={onMenuClick}
        className="flex items-center rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
