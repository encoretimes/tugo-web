'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoaded(true);

    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
  }, [searchParams]);

  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30000';
    if (provider === 'kakao') {
      window.location.href = `${apiUrl}/oauth/kakao/login`;
    } else if (provider === 'naver') {
      window.location.href = `${apiUrl}/oauth/naver/login`;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
          {/* Background Animation Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-pulse delay-700"></div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-start px-16 py-20 text-white">
            <div
              className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl font-bold text-primary-600">T</span>
                </div>
                <h1 className="text-4xl font-bold">Tugo</h1>
              </div>

              <h2 className="text-3xl font-bold mb-6 leading-tight">
                차세대 정치 커뮤니티
                <br />
                플랫폼에 오신 걸<br />
                환영합니다
              </h2>

              <div className="space-y-4 text-lg text-white/90">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>투명하고 건전한 정치 토론</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>다양한 의견 교환과 소통</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>신뢰할 수 있는 정보 공유</span>
                </div>
              </div>
            </div>

            <div
              className={`mt-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <p className="text-white/70 text-sm">
                &ldquo;정치는 우리 모두의 일입니다.
                <br />
                함께 더 나은 미래를 만들어가요.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo (shown only on mobile) */}
            <div className="lg:hidden text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">Tugo</h1>
              <p className="text-neutral-600">차세대 정치 커뮤니티 플랫폼</p>
            </div>

            <div
              className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-neutral-800 mb-3">
                  로그인
                </h2>
                <p className="text-neutral-600 text-lg">
                  소셜 계정으로 간편하게 시작하세요
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {/* Kakao Login Button */}
                <button
                  onClick={() => handleSocialLogin('kakao')}
                  className="w-full flex items-center justify-center gap-4 bg-[#FEE500] hover:bg-[#FBDC00] text-[#191919] font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2 group"
                >
                  <svg
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11L7.5 21l.11-2.717C4.62 16.93 1.5 14.582 1.5 11.185 1.5 6.665 6.201 3 12 3z" />
                  </svg>
                  <span className="text-lg">카카오로 로그인</span>
                </button>

                {/* Naver Login Button */}
                <button
                  onClick={() => handleSocialLogin('naver')}
                  className="w-full flex items-center justify-center gap-4 bg-[#03C75A] hover:bg-[#02B351] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#03C75A] focus:ring-offset-2 group"
                >
                  <svg
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                  </svg>
                  <span className="text-lg">네이버로 로그인</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center mb-8">
                <div className="flex-1 border-t border-neutral-300"></div>
                <div className="px-6 text-sm text-neutral-500 bg-white font-medium">
                  또는
                </div>
                <div className="flex-1 border-t border-neutral-300"></div>
              </div>

              {/* About Link */}
              <div className="text-center mb-8">
                <p className="text-neutral-600 mb-4">Tugo가 처음이신가요?</p>
                <a
                  href="/about"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  브랜딩 쇼케이스 둘러보기
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 text-sm text-neutral-500">
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="hover:text-neutral-700 transition-colors">
                이용약관
              </a>
              <a
                href="#"
                className="hover:text-neutral-700 transition-colors font-semibold"
              >
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-neutral-700 transition-colors">
                쿠키 설정
              </a>
              <a href="#" className="hover:text-neutral-700 transition-colors">
                고객센터
              </a>
              <a href="#" className="hover:text-neutral-700 transition-colors">
                회사소개
              </a>
            </div>
            <div className="text-center lg:text-right">
              <p>&copy; 2025 Tugo.</p>
            </div>
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
