'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-500">
          최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">목차</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#article-1" className="text-primary-600 hover:underline">
              제1조 (목적)
            </a>
          </li>
          <li>
            <a href="#article-2" className="text-primary-600 hover:underline">
              제2조 (정의)
            </a>
          </li>
          <li>
            <a href="#article-3" className="text-primary-600 hover:underline">
              제3조 (약관의 효력 및 변경)
            </a>
          </li>
          <li>
            <a href="#article-4" className="text-primary-600 hover:underline">
              제4조 (회원가입)
            </a>
          </li>
          <li>
            <a href="#article-5" className="text-primary-600 hover:underline">
              제5조 (서비스의 제공)
            </a>
          </li>
          <li>
            <a href="#article-6" className="text-primary-600 hover:underline">
              제6조 (게시물 관리)
            </a>
          </li>
          <li>
            <a href="#article-7" className="text-primary-600 hover:underline">
              제7조 (이용자의 의무)
            </a>
          </li>
          <li>
            <a href="#article-8" className="text-primary-600 hover:underline">
              제8조 (금지행위)
            </a>
          </li>
          <li>
            <a href="#article-9" className="text-primary-600 hover:underline">
              제9조 (서비스 이용제한)
            </a>
          </li>
          <li>
            <a href="#article-10" className="text-primary-600 hover:underline">
              제10조 (면책조항)
            </a>
          </li>
          <li>
            <a href="#article-11" className="text-primary-600 hover:underline">
              제11조 (분쟁해결)
            </a>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="space-y-10">
        <section id="article-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">제1조 (목적)</h2>
          <p className="text-gray-700 leading-relaxed">
            본 약관은 TUGO(이하 &quot;회사&quot;라 합니다)가 제공하는 정치
            커뮤니티 플랫폼 서비스(이하 &quot;서비스&quot;라 합니다)의 이용과
            관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한
            사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section id="article-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">제2조 (정의)</h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                &quot;서비스&quot;란 회사가 제공하는 정치 관련 콘텐츠 게시,
                구독, 투표, 토론 등의 온라인 플랫폼 서비스를 말합니다.
              </li>
              <li>
                &quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를
                이용하는 회원 및 비회원을 말합니다.
              </li>
              <li>
                &quot;회원&quot;이란 회사에 개인정보를 제공하고 회원등록을 한
                자로서, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </li>
              <li>
                &quot;크리에이터&quot;란 서비스 내에서 콘텐츠를 제작하여
                게시하고, 구독 서비스를 제공하는 회원을 말합니다.
              </li>
              <li>
                &quot;게시물&quot;이란 이용자가 서비스를 이용하면서 게시한 글,
                사진, 동영상, 투표 등 각종 정보를 말합니다.
              </li>
            </ol>
          </div>
        </section>

        <section id="article-3">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제3조 (약관의 효력 및 변경)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
              </li>
              <li>
                회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을
                변경할 수 있습니다.
              </li>
              <li>
                약관이 변경될 경우, 회사는 변경 내용을 시행일 7일 전부터 서비스
                내 공지사항을 통해 공지합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을
                중단하고 탈퇴할 수 있습니다.
              </li>
            </ol>
          </div>
        </section>

        <section id="article-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제4조 (회원가입)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                이용자는 회사가 정한 절차에 따라 회원가입을 신청할 수 있습니다.
              </li>
              <li>
                회원가입은 소셜 로그인(카카오, 네이버 등)을 통해 진행됩니다.
              </li>
              <li>
                회사는 다음 각 호에 해당하는 경우 회원가입을 거부하거나 사후에
                회원자격을 제한할 수 있습니다.
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>타인의 정보를 도용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>만 14세 미만인 경우</li>
                  <li>이전에 회원자격을 상실한 적이 있는 경우</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section id="article-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제5조 (서비스의 제공)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>정치 관련 콘텐츠 게시 및 열람 서비스</li>
              <li>크리에이터 구독 서비스</li>
              <li>실시간 투표 및 여론조사 서비스</li>
              <li>댓글 및 토론 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ol>
          </div>
        </section>

        <section id="article-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제6조 (게시물 관리)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>회원이 작성한 게시물의 저작권은 해당 회원에게 귀속됩니다.</li>
              <li>
                회사는 다음 각 호에 해당하는 게시물을 사전 통지 없이 삭제하거나
                노출을 제한할 수 있습니다.
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>타인의 권리를 침해하는 게시물</li>
                  <li>허위 사실을 유포하는 게시물</li>
                  <li>혐오, 차별, 폭력을 조장하는 게시물</li>
                  <li>관련 법령에 위반되는 게시물</li>
                  <li>커뮤니티 가이드라인을 위반하는 게시물</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section id="article-7">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제7조 (이용자의 의무)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>이용자는 본 약관 및 관계 법령을 준수해야 합니다.</li>
              <li>이용자는 타인의 권리와 명예를 존중해야 합니다.</li>
              <li>
                이용자는 서비스 이용 시 건전한 토론 문화를 형성하기 위해
                노력해야 합니다.
              </li>
              <li>이용자는 자신의 계정 정보를 안전하게 관리해야 합니다.</li>
            </ol>
          </div>
        </section>

        <section id="article-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제8조 (금지행위)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>이용자는 다음 각 호의 행위를 해서는 안 됩니다.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>타인의 개인정보를 수집, 저장, 공개하는 행위</li>
              <li>서비스의 운영을 방해하는 행위</li>
              <li>허위 정보를 유포하거나 사기를 목적으로 하는 행위</li>
              <li>특정 개인이나 단체에 대한 혐오, 차별 발언</li>
              <li>선거법 등 관련 법령을 위반하는 행위</li>
              <li>음란물 게시 또는 청소년에게 유해한 정보 제공</li>
              <li>영리 목적의 광고성 게시물 무단 게시</li>
              <li>
                회사의 사전 동의 없이 자동화된 방법으로 서비스에 접근하는 행위
              </li>
            </ol>
          </div>
        </section>

        <section id="article-9">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제9조 (서비스 이용제한)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 이용자가 본 약관 또는 관계 법령을 위반한 경우, 서비스
                이용을 제한할 수 있습니다.
              </li>
              <li>
                이용 제한의 종류는 다음과 같습니다.
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>경고</li>
                  <li>게시물 삭제</li>
                  <li>일정 기간 서비스 이용 정지</li>
                  <li>영구 이용 정지 및 회원 자격 박탈</li>
                </ul>
              </li>
              <li>
                이용자는 서비스 이용제한에 대해 이의가 있는 경우, 고객센터를
                통해 이의신청을 할 수 있습니다.
              </li>
            </ol>
          </div>
        </section>

        <section id="article-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제10조 (면책조항)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 천재지변, 불가항력적 사유로 인해 서비스를 제공할 수 없는
                경우 책임이 면제됩니다.
              </li>
              <li>
                회사는 이용자가 게시한 게시물의 정확성, 신뢰성에 대해 책임을
                지지 않습니다.
              </li>
              <li>
                회사는 이용자 간 또는 이용자와 제3자 간의 분쟁에 대해 관여하지
                않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
              </li>
              <li>
                회사는 무료로 제공하는 서비스에 대해서는 손해배상 책임이
                면제됩니다.
              </li>
            </ol>
          </div>
        </section>

        <section id="article-11">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            제11조 (분쟁해결)
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>본 약관과 관련된 분쟁은 대한민국 법률에 따라 해석됩니다.</li>
              <li>
                서비스 이용과 관련하여 발생한 분쟁에 대해서는 회사의 본사
                소재지를 관할하는 법원을 전속 관할 법원으로 합니다.
              </li>
            </ol>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          본 약관에 대한 문의사항은{' '}
          <a
            href="mailto:support@tugo.kr"
            className="text-primary-600 hover:underline"
          >
            support@tugo.kr
          </a>
          로 연락해 주시기 바랍니다.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/privacy"
            className="text-sm text-primary-600 hover:underline"
          >
            개인정보처리방침 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
