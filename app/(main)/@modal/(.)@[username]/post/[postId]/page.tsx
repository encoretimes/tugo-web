'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { usePost } from '@/hooks/usePosts';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import PostDetailDesktop from '@/app/components/post-detail/PostDetailDesktop';
import PostDetailMobile from '@/app/components/post-detail/PostDetailMobile';

interface PostModalPageProps {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}

export default function PostModalPage({ params }: PostModalPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const postId = parseInt(resolvedParams.postId, 10);
  const { data: post, isLoading, error } = usePost(postId);
  const isDesktop = useIsDesktop();

  const handleClose = () => {
    router.back();
  };

  // Render desktop or mobile version based on screen size
  if (!isDesktop) {
    return (
      <PostDetailMobile
        post={post}
        isLoading={isLoading}
        error={error}
        onClose={handleClose}
      />
    );
  }

  return (
    <PostDetailDesktop
      post={post}
      isLoading={isLoading}
      error={error}
      onClose={handleClose}
    />
  );
}
