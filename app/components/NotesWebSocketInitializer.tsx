'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNotesStore } from '@/store/notesStore';

export default function NotesWebSocketInitializer() {
  const user = useUserStore((state) => state.user);
  const connect = useNotesStore((state) => state.connect);
  const disconnect = useNotesStore((state) => state.disconnect);

  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }

    return () => {
      disconnect();
    };
  }, [user?.id, connect, disconnect]);

  return null;
}
