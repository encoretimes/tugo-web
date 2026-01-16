import { getApiUrl } from '@/config/env';

interface OAuthResult {
  success: boolean;
  error?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  } | null;
}

// localStorage 키 (팝업과 부모 창 간 토큰 전달용)
export const OAUTH_STORAGE_KEY = 'tugo_oauth_result';
// BroadcastChannel 이름
const OAUTH_CHANNEL_NAME = 'tugo_oauth';

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
 *
 * iOS Safari에서는 cross-origin 네비게이션 후 window.opener가 null이 되므로
 * BroadcastChannel과 localStorage를 사용하여 통신
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

    // 이전 OAuth 결과 정리
    localStorage.removeItem(OAUTH_STORAGE_KEY);

    const popup = window.open(
      `${apiUrl}/oauth/${provider}/login?mode=popup`,
      'TugoOAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      console.warn('[OAuth] Popup blocked, falling back to redirect');
      reject(new Error('Popup blocked'));
      return;
    }

    // BroadcastChannel 설정 (지원하는 브라우저용)
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'OAUTH_COMPLETE') {
          console.log('[OAuth] Received result via BroadcastChannel');
          cleanup();
          resolve(event.data.payload as OAuthResult);
        }
      };
    } catch {
      console.log('[OAuth] BroadcastChannel not supported, using localStorage fallback');
    }

    // postMessage 핸들러 (window.opener가 있는 경우용)
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OAUTH_COMPLETE') {
        console.log('[OAuth] Received result via postMessage');
        cleanup();
        resolve(event.data.payload as OAuthResult);
      }
    };

    // 팝업 닫힘 감지 + localStorage 폴백 체크
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        // 팝업이 닫혔을 때 localStorage에서 결과 확인 (iOS Safari 폴백)
        const storedResult = localStorage.getItem(OAUTH_STORAGE_KEY);
        if (storedResult) {
          try {
            const result = JSON.parse(storedResult) as OAuthResult;
            console.log('[OAuth] Received result via localStorage fallback');
            localStorage.removeItem(OAUTH_STORAGE_KEY);
            cleanup();
            resolve(result);
            return;
          } catch (e) {
            console.error('[OAuth] Failed to parse stored result:', e);
          }
        }

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
      if (channel) {
        channel.close();
      }
      localStorage.removeItem(OAUTH_STORAGE_KEY);
    };

    window.addEventListener('message', messageHandler);
  });
}
