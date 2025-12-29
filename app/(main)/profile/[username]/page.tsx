'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * 레거시 URL 리다이렉트
 * /profile/username → /@username
 */
export default function ProfileRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  useEffect(() => {
    router.replace(`/@${username}`);
  }, [username, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">이동 중...</div>
    </div>
  );
}
