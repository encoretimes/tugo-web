import { getApiUrl } from '@/config/env';

const TOKEN_REFRESH_THRESHOLD = 45 * 60 * 1000; // 선제 갱신 (45분)
const STORAGE_KEY_LAST_REFRESH = 'tugo_last_token_refresh';
const STORAGE_KEY_REFRESH_LOCK = 'tugo_token_refresh_lock';
const LOCK_TIMEOUT = 10000;

/**
 * 안전한 localStorage 접근 (Private Mode 예외처리)
 */
function safeLocalStorage() {
  return {
    getItem(key: string): string | null {
      try {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      try {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, value);
      } catch {}
    },
    removeItem(key: string): void {
      try {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
      } catch {}
    },
  };
}

const storage = safeLocalStorage();

/**
 * 토큰 갱신 서비스
 * - 단일 탭 내 중복 갱신 방지 (Promise 재사용)
 * - 멀티탭 환경 중복 갱신 방지 (localStorage 락킹)
 * - 마지막 갱신 시간 추적
 */
class AuthService {
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * 마지막 갱신 시간 조회
   */
  private getLastRefreshTime(): number {
    const stored = storage.getItem(STORAGE_KEY_LAST_REFRESH);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * 마지막 갱신 시간 저장
   */
  private setLastRefreshTime(): void {
    storage.setItem(STORAGE_KEY_LAST_REFRESH, Date.now().toString());
  }

  /**
   * 멀티탭 락 획득 시도
   */
  private acquireLock(): boolean {
    const lockData = storage.getItem(STORAGE_KEY_REFRESH_LOCK);
    if (lockData) {
      const lockTime = parseInt(lockData, 10);
      // 락 타임아웃 체크
      if (Date.now() - lockTime < LOCK_TIMEOUT) {
        return false;
      }
    }

    // 락 획득
    storage.setItem(STORAGE_KEY_REFRESH_LOCK, Date.now().toString());
    return true;
  }

  /**
   * 멀티탭 락 해제
   */
  private releaseLock(): void {
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }

  /**
   * 선제적 갱신이 필요한지 확인
   * Access Token 만료 45분 전에 갱신 권장
   */
  shouldRefreshPreemptively(): boolean {
    const lastRefresh = this.getLastRefreshTime();
    if (lastRefresh === 0) return false; // 아직 로그인 안 함
    return Date.now() - lastRefresh > TOKEN_REFRESH_THRESHOLD;
  }

  /**
   * 토큰 갱신 (멀티탭 안전)
   */
  async refreshTokens(): Promise<boolean> {
    // 이미 갱신 중일 떄
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 멀티탭 락 획득 시도
    if (!this.acquireLock()) {
      // 다른 탭이 갱신 중 - 잠시 대기 후 성공으로 간주 (다른 탭에서 갱신한 토큰이 쿠키에 설정됨)
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          this.setLastRefreshTime();
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.releaseLock();
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * 로그인 성공 시 호출 - 마지막 갱신 시간 초기화
   */
  markLoginSuccess(): void {
    this.setLastRefreshTime();
  }

  /**
   * 로그아웃 시 호출 - 저장된 시간 정보 삭제
   */
  clearRefreshData(): void {
    storage.removeItem(STORAGE_KEY_LAST_REFRESH);
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }
}

const authService = new AuthService();

class ApiClient {
  private getBaseURL(): string {
    return getApiUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnUnauthorized = true
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;

    // FormData인 경우 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    const isFormData = options.body instanceof FormData;

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: isFormData
        ? { ...options.headers }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      if (response.status === 401 && retryOnUnauthorized) {
        const refreshed = await authService.refreshTokens();

        if (refreshed) {
          return this.request<T>(endpoint, options, false);
        }

        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
        }
      }

      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return undefined as T;
    }

    const data = await response.json();

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

/**
 * 선제적 토큰 갱신 (visibilitychange 등에서 호출)
 * 만료 임박 시에만 갱신하여 불필요한 요청 방지
 */
export async function refreshTokensIfNeeded(): Promise<void> {
  try {
    if (authService.shouldRefreshPreemptively()) {
      await authService.refreshTokens();
    }
  } catch {}
}

/**
 * 로그인 성공 시 호출 - 토큰 갱신 타이머 초기화
 */
export function markLoginSuccess(): void {
  authService.markLoginSuccess();
}

/**
 * 로그아웃 시 호출 - 토큰 관련 데이터 정리
 */
export function clearAuthData(): void {
  authService.clearRefreshData();
}
