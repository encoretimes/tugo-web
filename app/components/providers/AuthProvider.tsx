'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';

interface MemberResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // 세션이 있는지 확인
        const userData =
          await apiClient.get<MemberResponse>('/api/v1/members/me');

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImageUrl: null,
        });
      } catch {
        // 인증 실패 시 로그아웃 상태로 설정
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
