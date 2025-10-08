'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import UsernameSetupModal from '@/components/modals/UsernameSetupModal';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, setLoading } = useUserStore();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const { data: currentUserData, isLoading, error } = useCurrentUser();

  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      console.log('[AuthProvider] Authentication failed, setting user to null');
      setUser(null);
      return;
    }

    if (currentUserData) {
      const { member, creator } = currentUserData;

      console.log('[AuthProvider] Member data:', member);
      console.log('[AuthProvider] Creator data:', creator);

      setUser({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        profileImageUrl: creator?.profileUrl || null,
        hasCreator: member.hasCreator,
        creatorId: member.creatorId,
        username: member.username,
      });

      console.log('[AuthProvider] User set with username:', member.username);

      // username이 설정되지 않았다면 모달 표시 (강제)
      if (!member.username) {
        setShowUsernameModal(true);
      }
    }
  }, [currentUserData, isLoading, error, setUser, setLoading]);

  // username 모달 닫기 - username이 설정된 경우에만 닫을 수 있음
  const handleUsernameModalClose = () => {
    // Zustand store의 user.username을 확인 (UsernameSetupModal에서 업데이트됨)
    if (user?.username) {
      setShowUsernameModal(false);
    }
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
