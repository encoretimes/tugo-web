import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
  HeartIcon,
  UserIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { Post as PostType } from '@/types/post';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useToggleBookmark } from '@/hooks/useBookmarks';
import { useToggleLike } from '@/hooks/useLikes';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useDeletePost } from '@/hooks/usePosts';
import { useVote } from '@/hooks/useVote';
import { queryKeys } from '@/lib/query-keys';
import EditPostModal from '@/app/components/modals/EditPostModal';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import ExpandableText from '@/app/components/ui/ExpandableText';
import ImageGalleryModal from '@/app/components/modals/ImageGalleryModal';
import PostMenuModal from '@/app/components/modals/PostMenuModal';
import ShareModal from '@/app/components/modals/ShareModal';
import PollCard from './PollCard';
import EmojiPickerButton from './EmojiPicker';
import MentionInput from './MentionInput';
import MentionText from './MentionText';
import ImageCarousel from './ImageCarousel';
import { formatRelativeTime } from '@/lib/date-utils';

interface PostProps {
  post: PostType;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
  disableNavigation?: boolean; // 상세 페이지에서는 네비게이션 비활성화
}

const Post: React.FC<PostProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
  disableNavigation = false,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);
  const { toggleBookmark } = useToggleBookmark();
  const { likeMutation, unlikeMutation } = useToggleLike();
  const createCommentMutation = useCreateComment();
  const deletePostMutation = useDeletePost();

  const { author, contentText, createdAt, stats } = post;
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [commentCount, setCommentCount] = useState(stats.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 댓글 목록 조회 (무한 스크롤) - showComments가 true일 때만 활성화
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(post.postId, showComments);

  const comments = commentsData?.pages.flatMap((page) => page.content) || [];

  // Poll vote hook (always call hooks at top level)
  const { vote: voteOnPoll, updateVote: updateVoteOnPoll } = useVote(
    post.poll?.pollId || 0
  );

  // 현재 사용자가 게시물 작성자인지 확인
  const isAuthor = user?.username === author.username;

  // Sync local state with prop when post data changes (e.g., after refresh)
  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsSaved(post.isSaved);
    setLikeCount(stats.likes);
    setCommentCount(stats.comments);
  }, [post.isLiked, post.isSaved, stats.likes, stats.comments]);

  const handleLikeToggle = () => {
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

    // 낙관적 업데이트
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      unlikeMutation.mutate(post.postId, {
        onError: () => {
          // 실패 시 롤백
          setIsLiked(previousIsLiked);
          setLikeCount(previousLikeCount);
        },
      });
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      likeMutation.mutate(
        { postId: post.postId },
        {
          onError: () => {
            // 실패 시 롤백
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
          },
        }
      );
    }
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

    toggleBookmark(post.postId, isSaved);
    setIsSaved(!isSaved);
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = () => {
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

    if (!commentText.trim() || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        postId: post.postId,
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText('');
          setCommentCount((prev) => prev + 1);
        },
      }
    );
  };

  const handleDeletePost = () => {
    deletePostMutation.mutate(post.postId, {
      onSuccess: () => {
        if (onPostDeleted) {
          onPostDeleted();
        }
      },
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageGallery(true);
  };

  const handlePostClick = () => {
    // 게시물 데이터를 미리 캐시에 설정 (즉시 표시를 위해)
    queryClient.setQueryData([...queryKeys.posts, post.postId], post);
    // Intercepting route를 통해 모달로 표시 (피드 상태 유지)
    router.push(`/@${author.username}/post/${post.postId}`);
  };

  return (
    <div className="border-b p-4">
      <div className="flex space-x-4">
        <Link href={`/profile/${author.username}`} className="flex-shrink-0">
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
              <UserIcon className="h-8 w-8 text-neutral-500" />
            </div>
          )}
        </Link>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href={`/profile/${author.username}`}
                className="font-bold hover:underline"
              >
                {author.name}
              </Link>
              <Link
                href={`/profile/${author.username}`}
                className="text-neutral-500 hover:underline"
              >
                @{author.username}
              </Link>
              <span className="text-neutral-500">
                · {formatRelativeTime(createdAt)}
              </span>
            </div>
          </div>
          <div>
            <ExpandableText
              text={contentText}
              maxLines={post.poll ? 10 : 20}
              onExpand={disableNavigation ? undefined : handlePostClick}
              showFullContent={disableNavigation}
            />
          </div>

          {/* Poll Card */}
          {post.poll && (
            <PollCard
              poll={post.poll}
              onVote={voteOnPoll}
              onRevote={updateVoteOnPoll}
            />
          )}

          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mt-3">
              <ImageCarousel
                images={post.mediaUrls}
                onImageClick={handleImageClick}
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
                  isLiked
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-neutral-500 hover:text-red-600 hover:bg-red-50'
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
                onClick={handleCommentToggle}
                className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-3 py-1.5 transition-colors"
              >
                <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                <span className="text-sm">{commentCount}</span>
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={`flex items-center rounded-full p-1.5 transition-colors ${
                  isSaved
                    ? 'text-primary-600 hover:bg-primary-50'
                    : 'text-neutral-500 hover:text-primary-600 hover:bg-primary-50'
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
              onClick={() => setShowPostMenu(true)}
              className="flex items-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full p-1.5 transition-colors"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>

          {showComments && (
            <div className="mt-4 border-t pt-4">
              <div className="mb-4">
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

              {isLoadingComments ? (
                <div className="py-4 text-center text-sm text-neutral-500">
                  댓글을 불러오는 중...
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
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
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-neutral-500">
                  댓글이 없습니다. 첫 댓글을 작성해보세요!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        postId={post.postId}
        initialContent={contentText}
        initialPostType={post.postType}
        initialPpvPrice={post.ppvPrice}
        onPostUpdated={onPostUpdated}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="게시물 삭제"
        message="정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />

      <ImageGalleryModal
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        images={post.mediaUrls || []}
        initialIndex={selectedImageIndex}
      />

      <PostMenuModal
        isOpen={showPostMenu}
        onClose={() => setShowPostMenu(false)}
        isAuthor={isAuthor}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteConfirm(true)}
        onShare={() => setShowShareModal(true)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={post.postId}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/@${author.username}/post/${post.postId}`}
      />
    </div>
  );
};

export default Post;
