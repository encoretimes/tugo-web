'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post as PostType } from '@/types/post';
import { UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { formatRelativeTime } from '@/lib/date-utils';
import PollCard from '@/app/components/feed/PollCard';
import { useVote } from '@/hooks/useVote';
import ImageCarousel from '@/app/components/feed/ImageCarousel';
import ImageGalleryModal from '@/app/components/modals/ImageGalleryModal';
import Post from '@/app/components/feed/Post';
import CommentItem from '@/app/components/feed/comments/CommentItem';
import CommentInput from '@/app/components/feed/comments/CommentInput';
import MentionText from '@/app/components/feed/MentionText';

interface PostDetailContentProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

// 댓글 스켈레톤 UI
function CommentSkeleton() {
  return (
    <div className="flex animate-pulse space-x-2">
      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 rounded bg-gray-100 dark:bg-neutral-800"></div>
        <div className="h-12 rounded bg-gray-100 dark:bg-neutral-800"></div>
      </div>
    </div>
  );
}

export default function PostDetailContent({
  post,
  isLoading,
  error,
  onClose,
}: PostDetailContentProps) {
  const router = useRouter();
  const { checkAuth, user } = useRequireAuth();
  const [commentText, setCommentText] = useState('');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleProfileNavigation = (username: string) => {
    onClose();
    setTimeout(() => {
      router.push(`/@${username}`);
    }, 10);
  };

  // 댓글 목록 조회 (무한 스크롤)
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(post?.postId || 0, !!post);

  const createCommentMutation = useCreateComment();
  const comments = commentsData?.pages.flatMap((page) => page.content) || [];

  // Poll vote hook
  const { vote: voteOnPoll, updateVote: updateVoteOnPoll } = useVote(
    post?.poll?.pollId || 0
  );

  const handleCommentSubmit = () => {
    if (!checkAuth()) return;
    if (!commentText.trim() || createCommentMutation.isPending || !post) return;

    createCommentMutation.mutate(
      {
        postId: post.postId,
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText('');
        },
      }
    );
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageGallery(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <p className="mb-2 font-medium text-red-600">
          게시물을 불러올 수 없습니다
        </p>
        <p className="text-center text-sm text-gray-500 dark:text-neutral-400">
          {error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다'}
        </p>
        <button
          onClick={onClose}
          className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          닫기
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <p className="mb-4 text-gray-500 dark:text-neutral-400">
          게시물을 찾을 수 없습니다
        </p>
        <button
          onClick={onClose}
          className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          닫기
        </button>
      </div>
    );
  }

  const { author, contentText, createdAt } = post;

  return (
    <>
      {/* 2열 레이아웃 (PC용) - 왼쪽 3 : 오른쪽 2 비율 */}
      <div
        className="hidden md:grid md:grid-cols-[3fr_2fr]"
        style={{ height: '85vh' }}
      >
        {/* 왼쪽 열: 작성자 정보 + 글 + 사진 - 독립 스크롤 */}
        <div className="h-full overflow-y-auto bg-white p-6 scrollbar-hide dark:bg-neutral-950">
          <div className="space-y-4">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3">
              <button
                className="flex-shrink-0"
                onClick={() => handleProfileNavigation(author.username)}
              >
                {author.profileImageUrl ? (
                  <Image
                    src={author.profileImageUrl}
                    alt={author.nickname || author.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full transition-opacity hover:opacity-80"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600">
                    <UserIcon className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                  </div>
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-left font-semibold text-gray-900 hover:underline dark:text-neutral-100"
                    onClick={() => handleProfileNavigation(author.username)}
                  >
                    {author.nickname || author.name}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                  <button
                    className="text-left hover:underline"
                    onClick={() => handleProfileNavigation(author.username)}
                  >
                    @{author.username}
                  </button>
                  <span>·</span>
                  <time>{formatRelativeTime(createdAt)}</time>
                </div>
              </div>
            </div>

            {/* 글 내용 */}
            <div className="whitespace-pre-wrap break-words text-gray-900 dark:text-neutral-100">
              <MentionText content={contentText} />
            </div>

            {/* 투표 */}
            {post.poll && (
              <div className="mt-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                      <ChartBarIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                      {post.poll.question || '투표에 참여해주세요'}
                    </span>
                  </div>
                  <PollCard
                    poll={post.poll}
                    onVote={voteOnPoll}
                    onRevote={updateVoteOnPoll}
                    hideQuestion={true}
                  />
                </div>
              </div>
            )}

            {/* 사진 */}
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mt-3 max-w-full overflow-hidden">
                <ImageCarousel
                  images={post.mediaUrls}
                  onImageClick={handleImageClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 열: 댓글 목록 + 댓글 작성 */}
        <div className="flex h-full flex-col rounded-r-lg border-l border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
          {/* 댓글 제목 */}
          <h3 className="mb-4 flex-shrink-0 font-semibold text-gray-900 dark:text-neutral-100">
            댓글
          </h3>

          {/* 댓글 목록 - 스크롤 영역 */}
          <div
            className="relative overflow-y-auto pr-4 scrollbar-hide"
            style={{ flex: '1 1 0', minHeight: 0 }}
          >
            <div className="space-y-3">
              {isLoadingComments ? (
                <>
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                </>
              ) : comments.length > 0 ? (
                <>
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                  {hasNextPage && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                      >
                        {isFetchingNextPage
                          ? '댓글 불러오는 중...'
                          : '댓글 더 보기'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  댓글이 없습니다. 첫 댓글을 작성해보세요!
                </div>
              )}
            </div>
          </div>

          {/* 댓글 작성 영역 - 하단 고정 */}
          <div className="mt-4 flex-shrink-0 border-t border-gray-200 pt-4 dark:border-neutral-700">
            <CommentInput
              userProfileImageUrl={user?.profileImageUrl}
              userName={user?.displayName || ''}
              value={commentText}
              onChange={setCommentText}
              onSubmit={handleCommentSubmit}
              isPending={createCommentMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 (기존 Post 컴포넌트 재사용) */}
      <div className="md:hidden">
        <Post post={post} disableNavigation={true} />
      </div>

      {/* 이미지 갤러리 모달 */}
      <ImageGalleryModal
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        images={post.mediaUrls || []}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
