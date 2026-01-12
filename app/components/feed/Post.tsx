'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Post as PostType } from '@/types/post';
import { useRequireAuth } from '@/hooks/useRequireAuth';
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
import ImageCarousel from './ImageCarousel';
import PostHeader from './post/PostHeader';
import PostActions from './post/PostActions';
import CommentSection from './comments/CommentSection';

interface PostProps {
  post: PostType;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
  disableNavigation?: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
  disableNavigation = false,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkAuth, user } = useRequireAuth();
  const { toggleBookmark } = useToggleBookmark();
  const { likeMutation, unlikeMutation } = useToggleLike();
  const createCommentMutation = useCreateComment();
  const deletePostMutation = useDeletePost();

  const { author, contentText, createdAt, stats } = post;

  // Like/Bookmark state
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [commentCount, setCommentCount] = useState(stats.comments);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(post.postId, showComments);

  const comments = commentsData?.pages.flatMap((page) => page.content) || [];

  const { vote: voteOnPoll, updateVote: updateVoteOnPoll } = useVote(
    post.poll?.pollId || 0
  );

  const isAuthor = user?.username === author.username;

  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsSaved(post.isSaved);
    setLikeCount(stats.likes);
    setCommentCount(stats.comments);
  }, [post.isLiked, post.isSaved, stats.likes, stats.comments]);

  const handleLikeToggle = useCallback(() => {
    if (!checkAuth()) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      unlikeMutation.mutate(post.postId, {
        onError: () => {
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
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
          },
        }
      );
    }
  }, [checkAuth, isLiked, likeCount, unlikeMutation, likeMutation, post.postId]);

  const handleBookmarkToggle = useCallback(() => {
    if (!checkAuth()) return;
    toggleBookmark(post.postId, isSaved);
    setIsSaved(!isSaved);
  }, [checkAuth, toggleBookmark, post.postId, isSaved]);

  const handleCommentToggle = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const handleCommentSubmit = useCallback(() => {
    if (!checkAuth()) return;
    if (!commentText.trim() || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { postId: post.postId, content: commentText },
      {
        onSuccess: () => {
          setCommentText('');
          setCommentCount((prev) => prev + 1);
        },
      }
    );
  }, [checkAuth, commentText, createCommentMutation, post.postId]);

  const handleDeletePost = useCallback(() => {
    deletePostMutation.mutate(post.postId, {
      onSuccess: () => onPostDeleted?.(),
    });
  }, [deletePostMutation, post.postId, onPostDeleted]);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setShowImageGallery(true);
  }, []);

  const handlePostClick = useCallback(() => {
    queryClient.setQueryData([...queryKeys.posts, post.postId], post);
    router.push(`/@${author.username}/post/${post.postId}`);
  }, [queryClient, post, author.username, router]);

  return (
    <div className="px-6 lg:px-6 py-5">
      <PostHeader
        author={author}
        createdAt={createdAt}
        disableNavigation={disableNavigation}
      />

      <div className="ml-0">
        <ExpandableText
          text={contentText}
          maxLines={post.poll ? 10 : 20}
          onExpand={disableNavigation ? undefined : handlePostClick}
          showFullContent={disableNavigation}
        />

        {post.poll && (
          <div className="mt-3">
            <PollCard
              poll={post.poll}
              onVote={voteOnPoll}
              onRevote={updateVoteOnPoll}
            />
          </div>
        )}

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="mt-3">
            <ImageCarousel
              images={post.mediaUrls}
              onImageClick={handleImageClick}
            />
          </div>
        )}

        <PostActions
          isLiked={isLiked}
          isSaved={isSaved}
          likeCount={likeCount}
          commentCount={commentCount}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
          onCommentToggle={handleCommentToggle}
          onMenuClick={() => setShowPostMenu(true)}
        />

        {showComments && (
          <CommentSection
            comments={comments}
            isLoading={isLoadingComments}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
            userProfileImageUrl={user?.profileImageUrl}
            userName={user?.name || ''}
            commentValue={commentText}
            onCommentChange={setCommentText}
            onCommentSubmit={handleCommentSubmit}
            isSubmitting={createCommentMutation.isPending}
          />
        )}
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

export default memo(Post);
