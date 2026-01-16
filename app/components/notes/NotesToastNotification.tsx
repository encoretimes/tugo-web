'use client';

import { useEffect, useState, useCallback } from 'react';
import { useNotesStore } from '@/store/notesStore';
import { useMobileNotesStore } from '@/store/mobileNotesStore';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import type { MessageResponse } from '@/types/notes';
import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastData {
  id: number;
  message: MessageResponse;
}

export default function NotesToastNotification() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const setGlobalMessageCallback = useNotesStore(
    (s) => s.setGlobalMessageCallback
  );
  const {
    isOpen: isNotesOpen,
    selectedChat,
    openNotes,
    openChat,
  } = useMobileNotesStore();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // PC에서 /notes 페이지에 있는지 확인
  const isOnNotesPage = pathname.startsWith('/notes');

  const handleNewMessage = useCallback(
    (message: MessageResponse) => {
      // 모바일: 해당 채팅방에 있으면 토스트 미표시
      if (isNotesOpen && selectedChat?.userId === message.senderId) {
        return;
      }

      // PC: /notes 페이지에 있으면 토스트 미표시 (이미 실시간 갱신됨)
      if (isOnNotesPage) {
        // 목록만 갱신
        queryClient.invalidateQueries({ queryKey: ['notes', 'rooms'] });
        return;
      }

      // 토스트 추가
      const toast: ToastData = {
        id: Date.now(),
        message,
      };
      setToasts((prev) => [...prev.slice(-2), toast]); // 최대 3개 유지

      // 채팅 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['notes', 'rooms'] });

      // 4초 후 자동 제거
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    },
    [isNotesOpen, selectedChat, isOnNotesPage, queryClient]
  );

  useEffect(() => {
    setGlobalMessageCallback(handleNewMessage);
    return () => setGlobalMessageCallback(null);
  }, [handleNewMessage, setGlobalMessageCallback]);

  const handleToastClick = (toast: ToastData) => {
    // 토스트 제거
    setToasts((prev) => prev.filter((t) => t.id !== toast.id));

    // 모바일: 쪽지 오버레이 열기
    openNotes();
    // 채팅방 열기 (senderId로)
    openChat({
      userId: toast.message.senderId,
    });
  };

  const handleDismiss = (e: React.MouseEvent, toastId: number) => {
    e.stopPropagation();
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-20 z-[200] space-y-2 lg:right-4 lg:top-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => handleToastClick(toast)}
          className="animate-slide-in-right dark:hover:bg-neutral-750 w-72 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                새 쪽지
              </p>
              <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-neutral-300">
                {toast.message.content}
              </p>
            </div>
            <button
              onClick={(e) => handleDismiss(e, toast.id)}
              className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700"
              aria-label="닫기"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
