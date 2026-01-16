'use client';

import { useEffect } from 'react';

/**
 * OAuth 팝업 콜백 페이지
 * 팝업 윈도우에서 OAuth 완료 후 부모 창에 메시지를 전송하고 팝업을 닫습니다.
 */
export default function PopupCallbackPage() {
  useEffect(() => {
    const handleCallback = () => {
      // 부모 창에 OAuth 완료 메시지 전송
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_COMPLETE',
            payload: { success: true },
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
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">로그인 완료 중...</p>
      </div>
    </div>
  );
}
