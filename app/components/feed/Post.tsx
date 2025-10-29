import React, { useState, useEffect, Fragment, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
  HeartIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
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
import { Menu, Transition } from '@headlessui/react';
import EditPostModal from '@/app/components/modals/EditPostModal';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import ExpandableText from '@/app/components/ui/ExpandableText';
import PollCard from './PollCard';
import EmojiPickerButton from './EmojiPicker';
import { formatRelativeTime } from '@/lib/date-utils';

interface PostProps {
  post: PostType;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onPostDeleted, onPostUpdated }) => {
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
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 댓글 목록 조회 (showComments가 true일 때만 활성화)
  const { data: commentsData, isLoading: isLoadingComments } = useComments(
    post.postId
  );

  const comments = commentsData || [];

  // Poll vote hook (always call hooks at top level)
  const { vote: voteOnPoll } = useVote(post.poll?.pollId || 0);

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
            {isAuthor && (
              <Menu as="div" className="relative">
                <Menu.Button className="rounded-full p-2 hover:bg-primary-50 transition-colors">
                  <EllipsisVerticalIcon className="h-5 w-5 text-neutral-500" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setShowEditModal(true)}
                            className={`${
                              active ? 'bg-neutral-100' : ''
                            } flex w-full items-center px-4 py-2 text-sm text-neutral-700`}
                          >
                            <PencilIcon className="mr-3 h-5 w-5" />
                            수정
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className={`${
                              active ? 'bg-red-50' : ''
                            } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                          >
                            <TrashIcon className="mr-3 h-5 w-5" />
                            삭제
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
          <div>
            <ExpandableText text={contentText} maxLines={post.poll ? 10 : 20} />
          </div>

          {/* Poll Card */}
          {post.poll && (
            <PollCard poll={post.poll} onVote={voteOnPoll} />
          )}

          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mt-3">
              {post.mediaUrls.length === 1 ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-200">
                  <Image
                    src={post.mediaUrls[0]}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              ) : post.mediaUrls.length === 2 ? (
                <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-neutral-200">
                  {post.mediaUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : post.mediaUrls.length === 3 ? (
                <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-neutral-200">
                  <div className="relative row-span-2">
                    <Image
                      src={post.mediaUrls[0]}
                      alt="Post image 1"
                      width={300}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src={post.mediaUrls[1]}
                      alt="Post image 2"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src={post.mediaUrls[2]}
                      alt="Post image 3"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-neutral-200">
                  {post.mediaUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 3 && post.mediaUrls!.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            +{post.mediaUrls!.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleCommentToggle}
              className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors"
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span>{commentCount}</span>
            </button>
            <button
              onClick={handleLikeToggle}
              className={`flex items-center space-x-2 rounded-full px-2 py-1 transition-colors ${
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
              <span>{likeCount}</span>
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`flex items-center space-x-2 rounded-full px-2 py-1 transition-colors ${
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
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
              <ArrowUpOnSquareIcon className="h-5 w-5" />
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
                    <textarea
                      ref={commentTextareaRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className="w-full resize-none rounded-lg border border-neutral-300 p-2 text-sm focus:border-primary-600 focus:outline-none"
                      rows={2}
                      disabled={createCommentMutation.isPending}
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <EmojiPickerButton
                        onEmojiSelect={(emoji) => {
                          const textarea = commentTextareaRef.current;
                          if (!textarea) {
                            setCommentText(commentText + emoji);
                            return;
                          }
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const newText = commentText.substring(0, start) + emoji + commentText.substring(end);
                          setCommentText(newText);
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                            textarea.focus();
                          }, 0);
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
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatRelativeTime(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
};

export default Post;
