'use client';

import Image from 'next/image';

const HomeBanner = () => {
  return (
    <div className="relative w-full overflow-visible bg-[#EDEBF0]">
      {/* 배경 이미지들 - 우측에 고정 배치 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="relative mx-auto h-full max-w-content">
          {/* 1번 이미지 - 중간 지점 */}
          <Image
            src="/home_banne_image/1.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 z-10 h-auto w-48 -translate-y-1/2"
            style={{ left: 'calc(50% + 50px)' }}
          />

          {/* 2번 이미지 - 1번 오른쪽, 뒤에 배치 */}
          <Image
            src="/home_banne_image/2.svg"
            alt=""
            width={180}
            height={180}
            className="absolute top-1/2 z-10 h-auto w-44 -translate-y-1/2"
            style={{ left: 'calc(50% + 190px)' }}
          />

          {/* 3번 이미지 - 2번 위에 겹침 */}
          <Image
            src="/home_banne_image/3.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 z-20 h-auto w-48 -translate-y-1/2"
            style={{ left: 'calc(50% + 290px)' }}
          />

          {/* 4번 이미지 - 가장 오른쪽, 280px 넘어도 OK */}
          <Image
            src="/home_banne_image/4.svg"
            alt=""
            width={200}
            height={200}
            className="absolute top-1/2 z-10 h-auto w-48 -translate-y-1/2"
            style={{ left: 'calc(50% + 470px)' }}
          />
        </div>
      </div>

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-30 mx-auto max-w-content py-16 lg:py-20">
        {/* TUGO 투고 */}
        <p className="mb-3 text-[24px] font-extrabold text-primary-700">
          TUGO 투고
        </p>

        {/* 메인 타이틀 */}
        <h1 className="mb-8">
          <span className="block text-[40px] font-extrabold leading-tight text-black">
            모든 우리의 정치는
          </span>
          <span className="block leading-tight">
            <span className="text-[40px] font-extrabold text-black">
              이제 여기{' '}
            </span>
            <span className="text-[48px] font-bold text-primary-600">TUGO</span>
            <span className="text-[40px] font-extrabold text-black">에서!</span>
          </span>
        </h1>

        {/* 설명 텍스트 */}
        <p className="whitespace-nowrap text-[18px] font-medium leading-relaxed text-black">
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
