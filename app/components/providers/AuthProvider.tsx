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
  const { setUser, setLoading } = useUserStore();
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

  // username 모달 닫기 - username이 파라미터로 전달되면 바로 닫기
  const handleUsernameModalClose = (username: string) => {
    // username이 설정되었으면 모달 닫기 (파라미터로 전달받음)
    if (username) {
      console.log(
        '[AuthProvider] Username modal closing with username:',
        username
      );
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
