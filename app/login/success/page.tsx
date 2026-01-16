'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { apiClient, markLoginSuccess } from '@/lib/api-client';
import { getApiUrl } from '@/config/env';

interface MemberResponse {
  id: number;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  username: string | null;
}

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);

        console.log(
          'Fetching user info from:',
          getApiUrl()
        );
        console.log('Cookies:', document.cookie);

        const userData =
          await apiClient.get<MemberResponse>('/api/v1/members/me');

        console.log('User data received:', userData);

        setUser({
          id: userData.id,
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role,
          profileImageUrl: null,
          username: userData.username,
        });

        // 토큰 갱신 타이머 초기화
        markLoginSuccess();

        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
        }

        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('로그인 정보를 가져오는데 실패했습니다:', error);
        console.error('Error details:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router, setUser, setLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
        <p className="text-neutral-600 text-lg">로그인 중입니다...</p>
      </div>
    </div>
  );
}
