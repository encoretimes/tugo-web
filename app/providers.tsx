'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import AuthProvider from './components/providers/AuthProvider';
import { ErrorBoundary } from './components/providers/ErrorBoundary';
import ToastContainer from './components/ui/ToastContainer';

/**
 * QueryClient 기본 옵션 설정
 *
 * 전략:
 * - staleTime: 1분 (데이터가 fresh 상태 유지 시간 → 중복 호출 방지)
 * - gcTime: 5분 (사용하지 않는 캐시 메모리 보관 시간)
 * - retry: 1회 (네트워크 에러 시 1번만 재시도)
 * - refetchOnWindowFocus: false (창 포커스 시 자동 refetch 비활성화)
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1분
        gcTime: 1000 * 60 * 5, // 5분
        retry: 1,
        refetchOnWindowFocus: false,
        // 글로벌 에러 핸들러는 개별 hooks에서 처리하도록 함
        // (AuthProvider에서 401 처리 등 특수한 케이스가 있기 때문)
      },
      mutations: {
        retry: 0, // Mutation은 재시도하지 않음 (사용자 액션)
        // onError는 각 mutation hook에서 개별적으로 처리
      },
    },
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => createQueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
