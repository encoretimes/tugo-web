'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post as PostType } from '@/types/post';
import { UserIcon } from '@heroicons/react/24/outline';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { formatRelativeTime } from '@/lib/date-utils';
import PollCard from '@/app/components/feed/PollCard';
import { useVote } from '@/hooks/useVote';
import ImageCarousel from '@/app/components/feed/ImageCarousel';
import MentionInput from '@/app/components/feed/MentionInput';
import MentionText from '@/app/components/feed/MentionText';
import EmojiPickerButton from '@/app/components/feed/EmojiPicker';
import ImageGalleryModal from '@/app/components/modals/ImageGalleryModal';
import Post from '@/app/components/feed/Post';

interface PostDetailContentProps {
  post: PostType | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

// 댓글 스켈레톤 UI
function CommentSkeleton() {
  return (
    <div className="flex space-x-2 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
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
  const { user } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);
  const [commentText, setCommentText] = useState('');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPollExpanded, setIsPollExpanded] = useState(true);

  const handleProfileNavigation = (username: string) => {
    onClose();
    setTimeout(() => {
      router.push(`/profile/${username}`);
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
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

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

  const { author, contentText, createdAt } = post;

  return (
    <>
      {/* 2열 레이아웃 (PC용) - 왼쪽 3 : 오른쪽 2 비율 */}
      <div
        className="hidden md:grid md:grid-cols-[3fr_2fr]"
        style={{ height: '85vh' }}
      >
        {/* 왼쪽 열: 작성자 정보 + 글 + 사진 - 독립 스크롤 */}
        <div className="overflow-y-auto scrollbar-hide p-6 h-full">
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
                    alt={author.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-300 hover:bg-neutral-400 transition-colors">
                    <UserIcon className="h-7 w-7 text-neutral-500" />
                  </div>
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    className="font-semibold text-gray-900 hover:underline text-left"
                    onClick={() => handleProfileNavigation(author.username)}
                  >
                    {author.name}
                  </button>
                  {author.isCreator && (
                    <span className="px-2 py-0.5 text-xs font-medium text-primary-600 bg-primary-50 rounded">
                      크리에이터
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button
                    className="hover:underline text-left"
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
            <div className="text-gray-900 whitespace-pre-wrap break-words">
              {contentText}
            </div>

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

        {/* 오른쪽 열: 설문조사 + 댓글 목록 + 댓글 작성 */}
        <div className="flex flex-col bg-gray-50 rounded-r-lg p-6 h-full">
          {/* 설문조사 (있는 경우만) - 접기/펼치기 가능 */}
          {post.poll && (
            <div className="mb-4 border-b pb-4 flex-shrink-0 overflow-hidden">
              <button
                onClick={() => setIsPollExpanded(!isPollExpanded)}
                className="w-full flex items-center justify-between mb-3 text-left font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                <span>설문조사</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isPollExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isPollExpanded && (
                <PollCard
                  poll={post.poll}
                  onVote={voteOnPoll}
                  onRevote={updateVoteOnPoll}
                />
              )}
            </div>
          )}

          {/* 댓글 제목 */}
          <h3 className="font-semibold text-gray-900 mb-4 flex-shrink-0">
            댓글
          </h3>

          {/* 댓글 목록 - 스크롤 영역 */}
          <div
            className="overflow-y-auto scrollbar-hide pr-4"
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
                    <div key={comment.id} className="flex space-x-2">
                      {comment.author.profileImageUrl ? (
                        <Image
                          src={comment.author.profileImageUrl}
                          alt={comment.author.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300">
                          <UserIcon className="h-5 w-5 text-neutral-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="rounded-lg bg-neutral-100 p-2">
                          <p className="text-xs font-semibold text-neutral-900">
                            {comment.author.name}{' '}
                            <span className="font-normal text-neutral-500">
                              @{comment.author.username}
                            </span>
                          </p>
                          <MentionText
                            content={comment.content}
                            className="text-sm mt-1"
                          />
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatRelativeTime(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {hasNextPage && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50"
                      >
                        {isFetchingNextPage
                          ? '댓글 불러오는 중...'
                          : '댓글 더 보기'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-sm text-neutral-500">
                  댓글이 없습니다. 첫 댓글을 작성해보세요!
                </div>
              )}
            </div>
          </div>

          {/* 댓글 작성 영역 - 하단 고정 (스크롤 영향 없음) */}
          <div className="border-t border-gray-200 pt-4 mt-4 flex-shrink-0">
            <div className="flex space-x-2">
              {user?.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300">
                  <UserIcon className="h-5 w-5 text-neutral-500" />
                </div>
              )}
              <div className="flex-1">
                <MentionInput
                  value={commentText}
                  onChange={setCommentText}
                  placeholder="댓글을 입력하세요..."
                  rows={2}
                  disabled={createCommentMutation.isPending}
                  className="w-full resize-none rounded-lg border border-neutral-300 p-2 text-sm focus:border-primary-600 focus:outline-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <EmojiPickerButton
                    onEmojiSelect={(emoji) => {
                      setCommentText(commentText + emoji);
                    }}
                    buttonClassName="text-gray-500 hover:text-gray-700"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={
                      !commentText.trim() || createCommentMutation.isPending
                    }
                    className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createCommentMutation.isPending
                      ? '작성 중...'
                      : '댓글 달기'}
                  </button>
                </div>
              </div>
            </div>
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
