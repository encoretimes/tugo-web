'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * OAuth 팝업 콜백 페이지
 * 팝업 윈도우에서 OAuth 완료 후 부모 창에 메시지를 전송하고 팝업을 닫습니다.
 * PWA 모드에서는 토큰을 URL 파라미터로 받아서 부모 창에 전달합니다.
 */
function PopupCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      // URL 파라미터에서 토큰 추출 (PWA용)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      // 부모 창에 OAuth 완료 메시지 전송
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_COMPLETE',
            payload: {
              success: true,
              // PWA용 토큰 전달 (있는 경우에만)
              tokens:
                accessToken && refreshToken
                  ? { accessToken, refreshToken }
                  : null,
            },
          },
          window.location.origin
        );

        // 팝업 닫기
        window.close();
      } else {
        // 부모 창이 없으면 (직접 접근 등) 홈으로 리다이렉트
        window.location.href = '/';
      }
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
