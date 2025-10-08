import React, { useState, useEffect, Fragment } from 'react';
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
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { Post as PostType } from '@/types/post';
import { apiClient } from '@/lib/api-client';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useToggleBookmark } from '@/hooks/useBookmarks';
import { Menu, Transition } from '@headlessui/react';
import EditPostModal from '@/app/components/modals/EditPostModal';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';

interface PostProps {
  post: PostType;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);
  const { toggleBookmark } = useToggleBookmark();
  const { author, contentText, createdAt, stats } = post;
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [commentCount, setCommentCount] = useState(stats.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<
    Array<{
      id: number;
      author: { name: string; username: string; profileImageUrl: string | null };
      content: string;
      createdAt: string;
    }>
  >([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 현재 사용자가 게시물 작성자인지 확인
  const isAuthor = user?.username === author.username;

  // Sync local state with prop when post data changes (e.g., after refresh)
  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsSaved(post.isSaved);
    setLikeCount(stats.likes);
    setCommentCount(stats.comments);
  }, [post.isLiked, post.isSaved, stats.likes, stats.comments]);

  const handleLikeToggle = async () => {
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

    try {
      if (isLiked) {
        await apiClient.delete(`/api/v1/likes/${post.postId}`);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await apiClient.post('/api/v1/likes', { postId: post.postId });
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      addToast('좋아요 처리에 실패했습니다', 'error');
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

  const handleCommentToggle = async () => {
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const response = await apiClient.get<{
          content: Array<{
            id: number;
            author: {
              name: string;
              username: string;
              profileImageUrl: string | null;
            };
            content: string;
            createdAt: string;
          }>;
        }>(`/api/v1/comments?postId=${post.postId}&page=0&size=10`);
        setComments(response.content);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }

    if (!commentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const response = await apiClient.post<{
        id: number;
        author: {
          name: string;
          username: string;
          profileImageUrl: string | null;
        };
        content: string;
        createdAt: string;
      }>('/api/v1/comments', {
        content: commentText,
        postId: post.postId,
      });
      setComments([response, ...comments]);
      setCommentCount((prev) => prev + 1);
      setCommentText('');
      addToast('댓글이 작성되었습니다', 'success');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      addToast('댓글 작성에 실패했습니다', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      await apiClient.delete(`/api/v1/posts/${post.postId}`);
      addToast('게시물이 삭제되었습니다', 'success');
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      addToast('게시물 삭제에 실패했습니다', 'error');
    }
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
              <span className="text-neutral-500">· {createdAt}</span>
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
            <p>{contentText}</p>
          </div>
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
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className="w-full resize-none rounded-lg border border-neutral-300 p-2 text-sm focus:border-primary-600 focus:outline-none"
                      rows={2}
                      disabled={isSubmittingComment}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        {isSubmittingComment ? '작성 중...' : '댓글 달기'}
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
                          {new Date(comment.createdAt).toLocaleString('ko-KR')}
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
