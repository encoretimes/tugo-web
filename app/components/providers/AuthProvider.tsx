'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';
import UsernameSetupModal from '@/components/modals/UsernameSetupModal';

interface MemberResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  hasCreator: boolean;
  creatorId: number | null;
  username: string | null; // publicName → username으로 변경
}

interface CreatorResponse {
  id: number;
  introduction: string;
  bannerImageUrl: string;
  profileUrl: string;
  username: string; // publicName → username으로 변경
  currentBalance: number;
  isActive: boolean;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useUserStore();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        console.log('[AuthProvider] Checking authentication...');

        // 세션이 있는지 확인
        const userData =
          await apiClient.get<MemberResponse>('/api/v1/members/me');

        console.log('[AuthProvider] Member data:', userData);
        console.log(
          '[AuthProvider] hasCreator:',
          userData.hasCreator,
          'creatorId:',
          userData.creatorId
        );

        let creatorData: CreatorResponse | null = null;

        // Creator가 있으면 상세 정보 가져오기
        if (userData.hasCreator && userData.creatorId) {
          try {
            console.log('[AuthProvider] Fetching creator details...');
            creatorData = await apiClient.get<CreatorResponse>(
              '/api/v1/creators/me'
            );
            console.log('[AuthProvider] Creator data:', creatorData);
          } catch (error) {
            console.error(
              '[AuthProvider] Failed to fetch creator data:',
              error
            );
          }
        } else {
          console.log('[AuthProvider] Skipping creator fetch - no creator');
        }

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImageUrl: creatorData?.profileUrl || null,
          hasCreator: userData.hasCreator,
          creatorId: userData.creatorId,
          username: userData.username, // Member의 username 사용
        });

        console.log(
          '[AuthProvider] User set with username:',
          userData.username
        );

        // username이 설정되지 않았다면 모달 표시
        if (!userData.username) {
          setShowUsernameModal(true);
        }
      } catch {
        console.log(
          '[AuthProvider] Authentication failed, setting user to null'
        );
        // 인증 실패 시 로그아웃 상태로 설정
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  // username 모달이 닫히면 user 상태 다시 확인
  const handleUsernameModalClose = () => {
    setShowUsernameModal(false);
  };

  return (
    <>
      {children}
      <UsernameSetupModal
        isOpen={showUsernameModal}
        onClose={handleUsernameModalClose}
      />
    </>
  );
}
