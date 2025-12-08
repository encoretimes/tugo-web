'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#6956E3]">
            TUGO
          </Link>
          <Link
            href="/login"
            className="bg-[#6956E3] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#5a48c9] transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-[#EDEBF0] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[#6956E3] font-bold text-lg mb-4">TUGO 투고</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            모든 우리의 정치는<br />
            이제 여기 <span className="text-[#6956E3]">TUGO</span>에서
          </h1>
          <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
            당신이 어떤 시각을 가지고 있는지, 무엇을 선택하는지 세상은 알고 싶어 합니다.
            지금 당장 새로운 이야기를 시작하세요.
          </p>
        </div>

        {/* Background decorative images */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 opacity-80">
          <Image src="/home_banne_image/1.svg" alt="" width={160} height={160} className="w-40" />
          <Image src="/home_banne_image/2.svg" alt="" width={140} height={140} className="w-36" />
          <Image src="/home_banne_image/3.svg" alt="" width={160} height={160} className="w-40" />
        </div>
      </section>

      {/* What is TUGO */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">TUGO는</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              정치적 콘텐츠를 생산하고 구독하는 새로운 방식의 플랫폼입니다.
            </p>
            <p>
              특정 정치색에 치우치지 않고, 다양한 시각의 크리에이터들이
              자신의 목소리를 낼 수 있는 공간을 만들어갑니다.
            </p>
            <p>
              TUGO에서는 누구나 크리에이터가 될 수 있고,
              관심 있는 크리에이터의 콘텐츠를 구독할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#FAF8FF]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            이런 점이 다릅니다
          </h2>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-[#6956E3] rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  구독 기반 콘텐츠
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  크리에이터가 만든 정치 콘텐츠를 구독하고,
                  양질의 분석과 시각을 접할 수 있습니다.
                  크리에이터는 구독료를 통해 지속 가능한 활동을 이어갑니다.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-[#6956E3] rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  투명한 댓글 시스템
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  댓글은 후원 금액에 따라 상위 노출됩니다.
                  더 많이 기여한 사람의 의견이 더 잘 보이는
                  명확하고 투명한 구조입니다.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-[#6956E3] rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  실시간 투표와 여론조사
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  다양한 이슈에 대한 투표에 참여하고,
                  실시간으로 여론의 흐름을 확인할 수 있습니다.
                  TUGO만의 데이터로 사회의 목소리를 읽어보세요.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-[#6956E3] rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  균형 잡힌 토론의 장
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  좌도 우도 아닌, 다양한 시각이 공존하는 공간.
                  서로 다른 의견을 존중하며 토론하고,
                  함께 더 나은 방향을 모색합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            지금 시작하세요
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            당신의 목소리가 세상을 바꿉니다
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#6956E3] text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-[#5a48c9] transition-colors"
          >
            TUGO 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">이용약관</a>
            <a href="#" className="hover:text-gray-600 font-medium">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-600">고객센터</a>
            <span>&copy; 2025 TUGO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
