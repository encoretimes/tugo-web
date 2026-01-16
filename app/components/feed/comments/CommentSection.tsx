'use client';

import { Comment } from '@/types/post';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface CommentSectionProps {
  comments: Comment[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
  // Comment input props
  userProfileImageUrl?: string | null;
  userName: string;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  isSubmitting?: boolean;
}

export default function CommentSection({
  comments,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
  userProfileImageUrl,
  userName,
  commentValue,
  onCommentChange,
  onCommentSubmit,
  isSubmitting = false,
}: CommentSectionProps) {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-neutral-800">
      <CommentInput
        userProfileImageUrl={userProfileImageUrl}
        userName={userName}
        value={commentValue}
        onChange={onCommentChange}
        onSubmit={onCommentSubmit}
        isPending={isSubmitting}
      />

      {isLoading ? (
        <div className="py-4 text-center text-sm text-neutral-500">
          댓글을 불러오는 중...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {hasNextPage && onFetchNextPage && (
            <div className="flex justify-center pt-2">
              <button
                onClick={onFetchNextPage}
                disabled={isFetchingNextPage}
                className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {isFetchingNextPage ? '댓글 불러오는 중...' : '댓글 더 보기'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-neutral-500">
          댓글이 없습니다. 첫 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
}
