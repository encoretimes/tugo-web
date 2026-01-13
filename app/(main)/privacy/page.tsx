'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          개인정보처리방침
        </h1>
        <p className="text-sm text-gray-500">
          최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">목차</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#section-1" className="text-primary-600 hover:underline">
              1. 수집하는 개인정보
            </a>
          </li>
          <li>
            <a href="#section-2" className="text-primary-600 hover:underline">
              2. 개인정보의 수집 방법
            </a>
          </li>
          <li>
            <a href="#section-3" className="text-primary-600 hover:underline">
              3. 개인정보의 이용 목적
            </a>
          </li>
          <li>
            <a href="#section-4" className="text-primary-600 hover:underline">
              4. 개인정보의 보유 및 이용 기간
            </a>
          </li>
          <li>
            <a href="#section-5" className="text-primary-600 hover:underline">
              5. 개인정보의 제3자 제공
            </a>
          </li>
          <li>
            <a href="#section-6" className="text-primary-600 hover:underline">
              6. 개인정보의 파기
            </a>
          </li>
          <li>
            <a href="#section-7" className="text-primary-600 hover:underline">
              7. 이용자의 권리와 행사 방법
            </a>
          </li>
          <li>
            <a href="#section-8" className="text-primary-600 hover:underline">
              8. 개인정보 보호를 위한 기술적 조치
            </a>
          </li>
          <li>
            <a href="#section-9" className="text-primary-600 hover:underline">
              9. 개인정보 보호책임자
            </a>
          </li>
          <li>
            <a href="#section-10" className="text-primary-600 hover:underline">
              10. 개인정보처리방침의 변경
            </a>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="space-y-10">
        <section>
          <p className="text-gray-700 leading-relaxed">
            TUGO(이하 &quot;회사&quot;라 합니다)는 이용자의 개인정보를
            중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본
            개인정보처리방침은 회사가 제공하는 서비스 이용과 관련하여 이용자의
            개인정보가 어떻게 수집, 이용, 보관, 파기되는지를 설명합니다.
          </p>
        </section>

        <section id="section-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            1. 수집하는 개인정보
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                필수 수집 정보
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  소셜 로그인 정보 (카카오/네이버): 이메일, 이름(닉네임), 프로필
                  이미지
                </li>
                <li>서비스 이용 기록: 접속 로그, 이용 기록, 접속 IP 정보</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                선택 수집 정보
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>프로필 정보: 자기소개, 관심 분야</li>
                <li>
                  결제 정보: 구독 시 결제 관련 정보 (결제 대행사를 통해 처리)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="section-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            2. 개인정보의 수집 방법
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <ul className="list-disc list-inside space-y-2">
              <li>소셜 로그인(카카오, 네이버)을 통한 회원가입 시</li>
              <li>서비스 이용 과정에서 자동으로 생성되는 정보</li>
              <li>고객센터를 통한 문의 시</li>
              <li>이벤트 참여 시</li>
            </ul>
          </div>
        </section>

        <section id="section-3">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            3. 개인정보의 이용 목적
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>회원 관리:</strong> 회원 식별, 가입 의사 확인, 본인
                확인, 부정 이용 방지
              </li>
              <li>
                <strong>서비스 제공:</strong> 콘텐츠 제공, 구독 서비스, 투표
                참여, 맞춤 서비스 제공
              </li>
              <li>
                <strong>서비스 개선:</strong> 신규 서비스 개발, 통계 분석,
                서비스 품질 향상
              </li>
              <li>
                <strong>고객 지원:</strong> 문의 응대, 공지사항 전달, 이용 안내
              </li>
              <li>
                <strong>마케팅:</strong> 이벤트 정보 제공 (동의한 이용자에 한함)
              </li>
            </ul>
          </div>
        </section>

        <section id="section-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            4. 개인정보의 보유 및 이용 기간
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당
              정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한
              경우에는 해당 기간 동안 보관합니다.
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                법령에 따른 보존 기간
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                <li>접속 기록: 3개월</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="section-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            5. 개인정보의 제3자 제공
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
            </ul>
          </div>
        </section>

        <section id="section-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            6. 개인정보의 파기
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">파기 방법</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="section-7">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            7. 이용자의 권리와 행사 방법
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>이용자는 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
            </ul>
            <p>
              위 권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 요청하실
              수 있습니다.
            </p>
          </div>
        </section>

        <section id="section-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            8. 개인정보 보호를 위한 기술적 조치
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <ul className="list-disc list-inside space-y-2">
              <li>
                개인정보의 암호화: 비밀번호 등 중요 정보는 암호화하여 저장
              </li>
              <li>해킹 등에 대비한 기술적 대책: 방화벽, 침입탐지시스템 운영</li>
              <li>접근 통제: 개인정보에 대한 접근 권한 최소화</li>
              <li>
                접속 기록 보관: 개인정보 처리 시스템에 대한 접속 기록 보관 및
                관리
              </li>
            </ul>
          </div>
        </section>

        <section id="section-9">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            9. 개인정보 보호책임자
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 이용자의 불만 처리 및 피해 구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">
                개인정보 보호책임자
              </p>
              <ul className="text-sm space-y-1">
                <li>이메일: privacy@tugo.kr</li>
                <li>고객센터: support@tugo.kr</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="section-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            10. 개인정보처리방침의 변경
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p>
              본 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라
              내용이 추가, 삭제 및 수정될 수 있습니다. 변경 사항은 시행 7일 전에
              서비스 내 공지사항을 통해 고지합니다.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          본 개인정보처리방침에 대한 문의사항은{' '}
          <a
            href="mailto:privacy@tugo.kr"
            className="text-primary-600 hover:underline"
          >
            privacy@tugo.kr
          </a>
          로 연락해 주시기 바랍니다.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/terms"
            className="text-sm text-primary-600 hover:underline"
          >
            이용약관 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
