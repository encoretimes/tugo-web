'use client';

import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import UsernameSetupModal from '@/components/modals/UsernameSetupModal';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserStore();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const { data: currentUserData, error } = useCurrentUser();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리했으면 스킵
    if (hasProcessed.current && !currentUserData) {
      return;
    }

    if (error) {
      if (!hasProcessed.current) {
        setUser(null);
        hasProcessed.current = true;
      }
      return;
    }

    if (currentUserData) {
      const { member } = currentUserData;

      setUser({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        profileImageUrl: null,
        username: member.username,
      });

      if (!member.username) {
        setShowUsernameModal(true);
      }

      hasProcessed.current = true;
    }
  }, [currentUserData, error, setUser]);

  const handleUsernameModalClose = (username: string) => {
    if (username) {
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
