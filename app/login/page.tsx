'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { getApiUrl } from '@/config/env';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUserStore();
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
  }, [searchParams]);

  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
    const apiUrl = getApiUrl();
    if (provider === 'kakao') {
      window.location.href = `${apiUrl}/oauth/kakao/login`;
    } else if (provider === 'naver') {
      window.location.href = `${apiUrl}/oauth/naver/login`;
    }
  };

  const handleDevLogin = async () => {
    try {
      // Call backend dev login endpoint to create a real session
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
        name: '개발자',
        email: 'dev@tugo.local',
        role: 'USER',
        profileImageUrl: null,
        username: 'developer',
      });

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
        <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center relative overflow-hidden">
          <div className="text-white px-12 xl:px-16 relative z-10">
            {/* TUGO 투고 */}
            <p className="text-sm font-semibold text-white/60 mb-4 tracking-wide uppercase">
              TUGO 투고
            </p>

            {/* 메인 타이틀 */}
            <h1 className="mb-8">
              <span className="block text-3xl xl:text-4xl font-bold leading-tight">
                건강한 정치 토론의
              </span>
              <span className="block leading-tight mt-2">
                <span className="text-3xl xl:text-4xl font-bold">
                  새로운 공간,{' '}
                </span>
                <span className="text-4xl xl:text-5xl font-bold">TUGO</span>
              </span>
            </h1>

            {/* 설명 텍스트 */}
            <p className="text-base xl:text-lg text-white/70 leading-relaxed">
              다양한 시각을 존중하는 열린 토론 플랫폼.
              <br />
              정치 크리에이터를 만나고, 여론을 확인하세요.
              <br />
              <span className="block mt-3 text-white/90 font-medium">
                지금 당장 새로운 이야기를 시작하세요.
              </span>
            </p>
          </div>

          {/* 배경 장식 - 직선적인 사각형 패턴 */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5" />
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10" />
        </div>

        {/* Right Login Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-12">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">Tugo</h1>
              <p className="text-gray-500 text-sm">
                차세대 정치 커뮤니티 플랫폼
              </p>
            </div>

            {/* Login Title */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
              <p className="text-gray-500 text-sm">
                소셜 계정으로 간편하게 시작하세요
              </p>
            </div>

            {/* Dev Mode Login - Only shown in development */}
            {isDev && (
              <>
                <div className="mb-6">
                  <button
                    onClick={handleDevLogin}
                    className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white font-medium py-3.5 px-6 rounded-md hover:bg-primary-700 transition-all border border-primary-700"
                  >
                    <svg
                      className="w-5 h-5"
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
                <div className="flex items-center mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-xs text-gray-400">또는</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              </>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleSocialLogin('kakao')}
                className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-medium py-3.5 px-6 rounded-md hover:brightness-95 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11L7.5 21l.11-2.717C4.62 16.93 1.5 14.582 1.5 11.185 1.5 6.665 6.201 3 12 3z" />
                </svg>
                <span>카카오로 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('naver')}
                className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white font-medium py-3.5 px-6 rounded-md hover:brightness-95 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                <span>네이버로 로그인</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-xs text-gray-400">또는</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* About Link */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-3">Tugo가 처음이신가요?</p>
              <Link
                href="/about"
                className="text-primary-600 text-sm font-medium hover:underline"
              >
                서비스 소개 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-gray-600">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-gray-600 font-medium">
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
