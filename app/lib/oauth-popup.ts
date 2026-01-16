import { getApiUrl } from '@/config/env';

interface OAuthResult {
  success: boolean;
  error?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  } | null;
}

/**
 * PWA standalone 모드인지 확인
 */
export function isPWAStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

/**
 * OAuth 팝업 윈도우 열기
 * PWA standalone 모드에서 OAuth 리다이렉트 시 standalone 컨텍스트를 유지하기 위함
 */
export function openOAuthPopup(
  provider: 'kakao' | 'naver'
): Promise<OAuthResult> {
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl();
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${apiUrl}/oauth/${provider}/login?mode=popup`,
      'TugoOAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      // 팝업이 차단된 경우 - 리다이렉트로 폴백
      console.warn('[OAuth] Popup blocked, falling back to redirect');
      reject(new Error('Popup blocked'));
      return;
    }

    // 메시지 핸들러
    const messageHandler = (event: MessageEvent) => {
      // 동일 origin 체크
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OAUTH_COMPLETE') {
        cleanup();
        resolve(event.data.payload as OAuthResult);
      }
    };

    // 팝업 닫힘 감지 (사용자가 직접 닫은 경우)
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('Login cancelled'));
      }
    }, 500);

    // 타임아웃 (5분)
    const timeoutTimer = setTimeout(
      () => {
        cleanup();
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error('Login timeout'));
      },
      5 * 60 * 1000
    );

    const cleanup = () => {
      window.removeEventListener('message', messageHandler);
      clearInterval(pollTimer);
      clearTimeout(timeoutTimer);
    };

    window.addEventListener('message', messageHandler);
  });
}
