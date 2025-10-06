'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-xl font-bold text-white">T</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Tugo</h1>
            </div>
            <Link
              href="/login"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              로그인
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-6 text-5xl font-bold text-neutral-900">
            차세대 정치 커뮤니티
            <br />
            <span className="text-primary-600">Tugo</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-neutral-600">
            투명하고 건전한 정치 토론의 장을 만들어갑니다.
            <br />
            다양한 의견을 나누고, 함께 성장하는 커뮤니티입니다.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
            >
              시작하기
            </Link>
            <a
              href="#features"
              className="rounded-xl border-2 border-primary-600 bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition-colors hover:bg-primary-50"
            >
              더 알아보기
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="mb-12 text-center text-3xl font-bold text-neutral-900">
            주요 기능
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-3 text-xl font-bold text-neutral-900">
                크리에이터 지원
              </h4>
              <p className="text-neutral-600">
                정치 크리에이터를 위한 구독 및 후원 시스템으로 지속 가능한
                콘텐츠 제작을 지원합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="mb-3 text-xl font-bold text-neutral-900">
                건전한 토론
              </h4>
              <p className="text-neutral-600">
                다양한 정치적 견해를 존중하며, 건설적인 대화와 토론이 이루어지는
                공간을 제공합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="mb-3 text-xl font-bold text-neutral-900">
                투명한 운영
              </h4>
              <p className="text-neutral-600">
                명확한 커뮤니티 가이드라인과 투명한 운영 정책으로 신뢰할 수 있는
                플랫폼을 지향합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="mb-6 text-4xl font-bold text-white">
            지금 바로 시작하세요
          </h3>
          <p className="mb-8 text-xl text-primary-100">
            Tugo와 함께 의미있는 정치 토론에 참여하세요
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
            <a href="#" className="transition-colors hover:text-neutral-700">
              이용약관
            </a>
            <a
              href="#"
              className="font-semibold transition-colors hover:text-neutral-700"
            >
              개인정보처리방침
            </a>
            <a href="#" className="transition-colors hover:text-neutral-700">
              고객센터
            </a>
            <a href="#" className="transition-colors hover:text-neutral-700">
              회사소개
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-neutral-500">
            &copy; 2025 Tugo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
