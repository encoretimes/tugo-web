'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';

interface MemberResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  hasCreator: boolean;
  creatorId: number | null;
  username: string | null;
}

interface CreatorResponse {
  id: number;
  introduction: string;
  bannerImageUrl: string;
  profileUrl: string;
  username: string;
  currentBalance: number;
  isActive: boolean;
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
          process.env.NEXT_PUBLIC_API_URL
        );
        console.log('Cookies:', document.cookie);

        const userData =
          await apiClient.get<MemberResponse>('/api/v1/members/me');

        console.log('User data received:', userData);

        console.log(
          'hasCreator:',
          userData.hasCreator,
          'creatorId:',
          userData.creatorId
        );

        let creatorData: CreatorResponse | null = null;

        if (userData.hasCreator && userData.creatorId) {
          try {
            console.log('Fetching creator details from /api/v1/creators/me');
            creatorData = await apiClient.get<CreatorResponse>(
              '/api/v1/creators/me'
            );
            console.log('Creator data received:', creatorData);
          } catch (error) {
            console.error('Failed to fetch creator data:', error);
          }
        } else {
          console.log(
            'Skipping creator fetch - hasCreator:',
            userData.hasCreator,
            'creatorId:',
            userData.creatorId
          );
        }

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImageUrl: creatorData?.profileUrl || null,
          hasCreator: userData.hasCreator,
          creatorId: userData.creatorId,
          username: userData.username,
        });

        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
        }

        // username이 없으면 메인으로 가서 자연스럽게 설정하도록 유도
        // (계정 설정 페이지에서 크리에이터 전환 시 username 입력)
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
