'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPost } from '@/services/posts';

export default function PostRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.postId);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId && !isNaN(postId),
  });

  useEffect(() => {
    if (post?.author?.username) {
      router.replace(`/${post.author.username}/post/${postId}`);
    }
  }, [post, postId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">게시물을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-gray-500">게시물을 찾을 수 없습니다.</div>
        <button
          onClick={() => router.push('/')}
          className="text-primary-500 hover:underline"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">이동 중...</div>
    </div>
  );
}
