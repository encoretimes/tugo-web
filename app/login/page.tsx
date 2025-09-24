'use client';

export default function LoginPage() {
  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
    if (provider === 'kakao') {
      window.location.href = 'http://localhost:30000/oauth/kakao/login';
    } else if (provider === 'naver') {
      window.location.href = 'http://localhost:30000/oauth/naver/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">투고</h1>
          <p className="text-gray-600">차세대 정치 커뮤니티 플랫폼</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
            <p className="text-gray-600">소셜 계정으로 간편하게 시작하세요</p>
          </div>

          <div className="space-y-4">
            {/* Kakao Login Button */}
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FBDC00] text-[#191919] font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11L7.5 21l.11-2.717C4.62 16.93 1.5 14.582 1.5 11.185 1.5 6.665 6.201 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>

            {/* Naver Login Button */}
            <button
              onClick={() => handleSocialLogin('naver')}
              className="w-full flex items-center justify-center gap-3 bg-[#03C75A] hover:bg-[#02B351] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#03C75A] focus:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L7.5 7.5H12V22l4.5-4.5V7.5H21L12 2z"/>
              </svg>
              네이버로 로그인
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <div className="px-4 text-sm text-gray-500 bg-white">또는</div>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Guest Access */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              계정 없이 둘러보기
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
              게스트로 시작하기 →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>로그인 시 <span className="text-blue-600">이용약관</span> 및 <span className="text-blue-600">개인정보처리방침</span>에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  );
}