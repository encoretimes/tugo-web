'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { getApiUrl, getConfig } from '@/config/env';
import { apiClient, markLoginSuccess } from '@/lib/api-client';
import { isPWAStandalone, openOAuthPopup } from '@/lib/oauth-popup';
import { saveTokens } from '@/lib/token-storage';

interface MemberResponse {
  id: number;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  username: string | null;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isDev, setIsDev] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }

    getConfig().then((config) => {
      setIsDev(config.runtimeEnv === 'development');
    });
  }, [searchParams]);

  const handleSocialLogin = async (provider: 'kakao' | 'naver') => {
    const apiUrl = getApiUrl();

    // PWA standalone 모드에서는 팝업 사용
    if (isPWAStandalone()) {
      setIsLoading(true);
      try {
        const result = await openOAuthPopup(provider);

        if (result.success) {
          // OAuth 성공 - 사용자 정보 가져오기
          const userData =
            await apiClient.get<MemberResponse>('/api/v1/members/me');
          setUser({
            id: userData.id,
            displayName: userData.displayName,
            email: userData.email,
            role: userData.role,
            profileImageUrl: null,
            username: userData.username,
          });

          // 토큰 갱신 타이머 초기화
          markLoginSuccess();

          // PWA 모드: IndexedDB에 토큰 저장 (앱 재시작 시 세션 복구용)
          try {
            const tokens = await apiClient.post<TokenResponse>(
              '/api/v1/auth/token-exchange'
            );
            if (tokens?.accessToken && tokens?.refreshToken) {
              await saveTokens(tokens.accessToken, tokens.refreshToken);
              console.log('[Login] PWA tokens saved to IndexedDB');
            }
          } catch (tokenError) {
            console.warn('[Login] PWA token save failed:', tokenError);
          }

          const returnUrl = sessionStorage.getItem('returnUrl');
          if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            router.push(returnUrl);
          } else {
            router.push('/');
          }
        }
      } catch {
        // 팝업 차단 또는 취소 - 리다이렉트로 폴백
        console.warn('[Login] Popup OAuth failed, falling back to redirect');
        if (provider === 'kakao') {
          window.location.href = `${apiUrl}/oauth/kakao/login`;
        } else if (provider === 'naver') {
          window.location.href = `${apiUrl}/oauth/naver/login`;
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // 일반 브라우저 - 리다이렉트 사용
      if (provider === 'kakao') {
        window.location.href = `${apiUrl}/oauth/kakao/login`;
      } else if (provider === 'naver') {
        window.location.href = `${apiUrl}/oauth/naver/login`;
      }
    }
  };

  const handleDevLogin = async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/v1/dev/login`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dev login failed:', response.status, errorText);
        throw new Error(`Dev login failed: ${response.status} - ${errorText}`);
      }

      setUser({
        id: 1,
        displayName: '개발자',
        email: 'dev@tugo.local',
        role: 'USER',
        profileImageUrl: null,
        username: 'developer',
      });

      // 토큰 갱신 타이머 초기화
      markLoginSuccess();

      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl) {
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Dev login error:', error);
      alert(
        '개발자 로그인에 실패했습니다. 서버가 실행 중인지 확인하세요.\n' +
          'Docker Compose를 재시작했는지 확인하세요.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Brand Section - PC only */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-primary-600 lg:flex lg:w-1/2">
          <div className="relative z-10 px-12 text-white xl:px-16">
            {/* TUGO 투고 */}
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
              TUGO 투고
            </p>

            {/* 메인 타이틀 */}
            <h1 className="mb-8">
              <span className="block text-3xl font-bold leading-tight xl:text-4xl">
                건강한 정치 토론의
              </span>
              <span className="mt-2 block leading-tight">
                <span className="text-3xl font-bold xl:text-4xl">
                  새로운 공간,{' '}
                </span>
                <span className="text-4xl font-bold xl:text-5xl">TUGO</span>
              </span>
            </h1>

            {/* 설명 텍스트 */}
            <p className="text-base leading-relaxed text-white/70 xl:text-lg">
              다양한 시각을 존중하는 열린 토론 플랫폼.
              <br />
              정치 크리에이터를 만나고, 여론을 확인하세요.
              <br />
              <span className="mt-3 block font-medium text-white/90">
                지금 당장 새로운 이야기를 시작하세요.
              </span>
            </p>
          </div>

          {/* 배경 장식 - 직선적인 사각형 패턴 */}
          <div className="absolute bottom-0 right-0 h-64 w-64 bg-white/5" />
          <div className="absolute left-0 top-0 h-40 w-40 bg-white/5" />
          <div className="absolute bottom-20 left-20 h-24 w-24 border border-white/10" />
        </div>

        {/* Right Login Section */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="mb-12 text-center lg:hidden">
              <h1 className="mb-2 text-3xl font-bold text-primary-600">Tugo</h1>
              <p className="text-sm text-gray-500">
                차세대 정치 커뮤니티 플랫폼
              </p>
            </div>

            {/* Login Title */}
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">로그인</h2>
              <p className="text-sm text-gray-500">
                소셜 계정으로 간편하게 시작하세요
              </p>
            </div>

            {/* Dev Mode Login - Only shown in development */}
            {isDev && (
              <>
                <div className="mb-6">
                  <button
                    onClick={handleDevLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-md border border-primary-700 bg-primary-600 px-6 py-3.5 font-medium text-white transition-all hover:bg-primary-700"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <span>개발자 모드로 로그인 (Dev Only)</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="mb-6 flex items-center">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="px-4 text-xs text-gray-400">또는</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
              </>
            )}

            {/* Social Login Buttons */}
            <div className="mb-8 space-y-3">
              <button
                onClick={() => handleSocialLogin('kakao')}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#FEE500] px-6 py-3.5 font-medium text-[#191919] transition-all hover:brightness-95 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11L7.5 21l.11-2.717C4.62 16.93 1.5 14.582 1.5 11.185 1.5 6.665 6.201 3 12 3z" />
                </svg>
                <span>{isLoading ? '로그인 중...' : '카카오로 로그인'}</span>
              </button>

              <button
                onClick={() => handleSocialLogin('naver')}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#03C75A] px-6 py-3.5 font-medium text-white transition-all hover:brightness-95 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                <span>{isLoading ? '로그인 중...' : '네이버로 로그인'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="mb-8 flex items-center">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="px-4 text-xs text-gray-400">또는</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* About Link */}
            <div className="text-center">
              <p className="mb-3 text-sm text-gray-500">Tugo가 처음이신가요?</p>
              <Link
                href="/about"
                className="text-sm font-medium text-primary-600 hover:underline"
              >
                서비스 소개 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-gray-600">
              이용약관
            </Link>
            <Link href="/privacy" className="font-medium hover:text-gray-600">
              개인정보처리방침
            </Link>
            <a href="#" className="hover:text-gray-600">
              고객센터
            </a>
            <span>&copy; 2025 Tugo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
