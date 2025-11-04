'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { usePost } from '@/hooks/usePosts';
import PostDetailFullPage from '@/app/components/post-detail/PostDetailFullPage';

interface PostDetailPageProps {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const postId = parseInt(resolvedParams.postId, 10);
  const { data: post, isLoading, error } = usePost(postId);

  const handleBack = () => {
    const hasHistory =
      typeof window !== 'undefined' && window.history.length > 2;

    if (hasHistory) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <PostDetailFullPage
      post={post}
      isLoading={isLoading}
      error={error}
      onBack={handleBack}
    />
  );
}
