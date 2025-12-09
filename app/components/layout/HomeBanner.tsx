'use client';

import Image from 'next/image';

const HomeBanner = () => {
  return (
    <div className="w-full bg-[#EDEBF0] relative overflow-visible">
      {/* 배경 이미지들 - 우측에 고정 배치 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-content mx-auto h-full relative">
          {/* 1번 이미지 - 중간 지점 */}
          <Image
            src="/home_banne_image/1.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 -translate-y-1/2 w-48 h-auto z-10"
            style={{ left: 'calc(50% + 50px)' }}
          />

          {/* 2번 이미지 - 1번 오른쪽, 뒤에 배치 */}
          <Image
            src="/home_banne_image/2.svg"
            alt=""
            width={180}
            height={180}
            className="absolute top-1/2 -translate-y-1/2 w-44 h-auto z-10"
            style={{ left: 'calc(50% + 190px)' }}
          />

          {/* 3번 이미지 - 2번 위에 겹침 */}
          <Image
            src="/home_banne_image/3.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 -translate-y-1/2 w-48 h-auto z-20"
            style={{ left: 'calc(50% + 290px)' }}
          />

          {/* 4번 이미지 - 가장 오른쪽, 280px 넘어도 OK */}
          <Image
            src="/home_banne_image/4.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 -translate-y-1/2 w-48 h-auto z-10"
            style={{ left: 'calc(50% + 470px)' }}
          />
        </div>
      </div>

      {/* 텍스트 컨텐츠 */}
      <div className="max-w-content mx-auto py-16 lg:py-20 relative z-30">
        {/* TUGO 투고 */}
        <p className="text-[24px] font-extrabold text-[#2F1E9D] mb-3">
          TUGO 투고
        </p>

        {/* 메인 타이틀 */}
        <h1 className="mb-8">
          <span className="block text-[40px] font-extrabold text-black leading-tight">
            모든 우리의 정치는
          </span>
          <span className="block leading-tight">
            <span className="text-[40px] font-extrabold text-black">
              이제 여기{' '}
            </span>
            <span className="text-[48px] font-bold text-[#6956E3]">TUGO</span>
            <span className="text-[40px] font-extrabold text-black">에서!</span>
          </span>
        </h1>

        {/* 설명 텍스트 */}
        <p className="text-[18px] font-medium text-black leading-relaxed whitespace-nowrap">
          당신이 어떤 시각을 가지고 있는지, 무엇을 선택하는지 세상은 알고 싶어
          합니다.
          <br />
          지금 당장 사람들의 시선과 흐름을 바꾸고, 새로운 이야기를 시작하세요.
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;
