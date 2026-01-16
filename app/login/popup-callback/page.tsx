'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OAUTH_STORAGE_KEY } from '@/lib/oauth-popup';

// BroadcastChannel 이름 (oauth-popup.ts와 동일)
const OAUTH_CHANNEL_NAME = 'tugo_oauth';

/**
 * OAuth 팝업 콜백 페이지
 * 팝업 윈도우에서 OAuth 완료 후 부모 창에 메시지를 전송하고 팝업을 닫습니다.
 *
 * iOS Safari에서는 cross-origin 네비게이션 후 window.opener가 null이 되므로
 * BroadcastChannel과 localStorage를 사용하여 통신합니다.
 */
function PopupCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      // URL 파라미터에서 토큰 추출 (백엔드에서 전달)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      const oauthResult = {
        type: 'OAUTH_COMPLETE',
        payload: {
          success: true,
          tokens:
            accessToken && refreshToken
              ? { accessToken, refreshToken }
              : null,
        },
      };

      // 1. BroadcastChannel로 전송 (지원하는 브라우저용)
      try {
        const channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);
        channel.postMessage(oauthResult);
        channel.close();
        console.log('[PopupCallback] Sent result via BroadcastChannel');
      } catch {
        console.log('[PopupCallback] BroadcastChannel not supported');
      }

      // 2. localStorage에 저장 (iOS Safari 폴백용)
      // 부모 창이 팝업 닫힘을 감지하면 이 값을 읽음
      try {
        localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(oauthResult.payload));
        console.log('[PopupCallback] Saved result to localStorage');
      } catch (e) {
        console.error('[PopupCallback] Failed to save to localStorage:', e);
      }

      // 3. window.opener가 있으면 postMessage도 전송 (기존 방식)
      if (window.opener) {
        try {
          window.opener.postMessage(oauthResult, window.location.origin);
          console.log('[PopupCallback] Sent result via postMessage');
        } catch (e) {
          console.error('[PopupCallback] postMessage failed:', e);
        }
      } else {
        console.log('[PopupCallback] window.opener is null (expected on iOS Safari)');
      }

      // 팝업 닫기
      window.close();
    };

    // 즉시 실행
    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        <p className="text-gray-600">로그인 완료 중...</p>
      </div>
    </div>
  );
}

export default function PopupCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
            <p className="text-gray-600">로그인 완료 중...</p>
          </div>
        </div>
      }
    >
      <PopupCallbackContent />
    </Suspense>
  );
}
