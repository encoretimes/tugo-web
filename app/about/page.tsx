'use client';

import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            TUGO
          </Link>
          <Link
            href="/login"
            className="bg-primary-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-primary-200 font-semibold text-sm mb-4 tracking-wide uppercase">
            차세대 정치 커뮤니티 플랫폼
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            건강한 정치 토론의
            <br />
            새로운 공간, <span className="text-primary-200">TUGO</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            다양한 시각을 존중하는 열린 토론 플랫폼.
            <br />
            정치 크리에이터를 만나고, 여론의 흐름을 확인하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              지금 시작하기
            </Link>
            <Link
              href="#features"
              className="inline-block border border-white/30 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-white/10 transition-colors text-center"
            >
              자세히 알아보기
            </Link>
          </div>
        </div>

        {/* Background decorative elements - 직선적인 패턴 */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5" />
        <div className="absolute right-20 bottom-0 w-64 h-64 border border-white/10" />
        <div className="absolute left-10 bottom-10 w-32 h-32 bg-white/5" />
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                10K+
              </p>
              <p className="text-gray-600 text-sm">활성 사용자</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                500+
              </p>
              <p className="text-gray-600 text-sm">정치 크리에이터</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                50K+
              </p>
              <p className="text-gray-600 text-sm">투표 참여</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                100K+
              </p>
              <p className="text-gray-600 text-sm">게시물</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is TUGO */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            TUGO란?
          </h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              TUGO는 정치적 콘텐츠를 생산하고 소비하는 새로운 방식의 플랫폼입니다.
            </p>
            <p>
              특정 정치색에 치우치지 않고, 다양한 시각의 크리에이터들이 자신의
              목소리를 낼 수 있는 공간을 만들어갑니다.
            </p>
            <p>
              누구나 크리에이터가 될 수 있고, 관심 있는 크리에이터의 콘텐츠를
              구독할 수 있습니다. 실시간 투표와 여론조사로 사회의 목소리를
              직접 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              정치 토론 플랫폼
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              건강한 정치 토론을 위한 다양한 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center mb-6">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                열린 토론 공간
              </h3>
              <p className="text-gray-600 leading-relaxed">
                좌도 우도 아닌, 다양한 시각이 공존하는 공간. 서로 다른 의견을
                존중하며 건설적인 토론을 나눕니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center mb-6">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                실시간 투표
              </h3>
              <p className="text-gray-600 leading-relaxed">
                다양한 이슈에 대한 투표에 참여하고, 실시간으로 여론의 흐름을
                확인할 수 있습니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                신뢰할 수 있는 환경
              </h3>
              <p className="text-gray-600 leading-relaxed">
                명확한 커뮤니티 가이드라인과 투명한 운영으로 건전한 토론 문화를
                만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              크리에이터 플랫폼
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              정치 크리에이터로서 활동하고 수익을 창출하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Creator Feature 1 */}
            <div className="bg-gray-50 p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mb-6">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                구독자 관리
              </h3>
              <p className="text-gray-600 leading-relaxed">
                구독자와 직접 소통하고, 구독자 전용 콘텐츠로 충성도 높은
                팬층을 구축하세요.
              </p>
            </div>

            {/* Creator Feature 2 */}
            <div className="bg-gray-50 p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mb-6">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                수익 창출
              </h3>
              <p className="text-gray-600 leading-relaxed">
                구독료와 후원을 통해 지속 가능한 콘텐츠 활동을 이어갈 수
                있습니다.
              </p>
            </div>

            {/* Creator Feature 3 */}
            <div className="bg-gray-50 p-8 border border-gray-200 rounded-md">
              <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mb-6">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                크리에이터 도구
              </h3>
              <p className="text-gray-600 leading-relaxed">
                게시물 분석, 구독자 인사이트 등 크리에이터를 위한 다양한
                도구를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            안전하고 투명한 플랫폼
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            TUGO는 건강한 정치 토론 문화를 위해 명확한 커뮤니티 가이드라인을
            운영합니다. 혐오 발언, 허위 정보 유포 등은 엄격히 제한됩니다.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-2xl font-bold text-primary-300 mb-2">
                24시간
              </p>
              <p className="text-gray-400">모니터링 운영</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-300 mb-2">
                투명한
              </p>
              <p className="text-gray-400">운영 정책 공개</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-300 mb-2">
                신속한
              </p>
              <p className="text-gray-400">신고 처리</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            지금 시작하세요
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
            당신의 목소리가 세상을 바꿉니다.
            <br />
            TUGO에서 새로운 정치 토론을 경험하세요.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary-600 text-white px-10 py-4 rounded-md text-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            TUGO 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-700">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-gray-700 font-medium">
              개인정보처리방침
            </Link>
            <a href="#" className="hover:text-gray-700">
              고객센터
            </a>
            <span className="text-gray-400">&copy; 2025 TUGO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
