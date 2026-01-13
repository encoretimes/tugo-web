import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TUGO - 차세대 정치 커뮤니티 플랫폼 | 건강한 정치 토론의 새로운 공간',
  description:
    'TUGO는 다양한 시각을 존중하는 열린 정치 토론 플랫폼입니다. 정치 크리에이터를 만나고, 실시간 투표에 참여하며, 여론의 흐름을 확인하세요. 건강한 정치 토론 문화를 함께 만들어갑니다.',
  keywords: [
    '정치 커뮤니티',
    '정치 토론',
    '정치 플랫폼',
    '정치 크리에이터',
    '실시간 투표',
    '여론조사',
    'TUGO',
    '투고',
    '정치 SNS',
    '시민 참여',
  ],
  authors: [{ name: 'TUGO' }],
  creator: 'TUGO',
  publisher: 'TUGO',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://tugo.kr/about',
    siteName: 'TUGO',
    title: 'TUGO - 건강한 정치 토론의 새로운 공간',
    description:
      '다양한 시각을 존중하는 열린 정치 토론 플랫폼. 정치 크리에이터를 만나고, 여론의 흐름을 확인하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TUGO - 차세대 정치 커뮤니티 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TUGO - 건강한 정치 토론의 새로운 공간',
    description:
      '다양한 시각을 존중하는 열린 정치 토론 플랫폼. 정치 크리에이터를 만나고, 여론의 흐름을 확인하세요.',
    images: ['/og-image.png'],
    creator: '@tugo_kr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tugo.kr/about',
    languages: {
      'ko-KR': 'https://tugo.kr/about',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'naver-site-verification': 'naver-verification-code',
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'TUGO',
            alternateName: '투고',
            url: 'https://tugo.kr',
            description: '차세대 정치 커뮤니티 플랫폼',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://tugo.kr/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: 'TUGO',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tugo.kr/logo.svg',
              },
            },
            sameAs: [
              'https://twitter.com/tugo_kr',
              'https://www.instagram.com/tugo_kr',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TUGO',
            url: 'https://tugo.kr',
            logo: 'https://tugo.kr/logo.svg',
            description:
              '건강한 정치 토론을 위한 차세대 커뮤니티 플랫폼입니다.',
            foundingDate: '2025',
            founders: [
              {
                '@type': 'Person',
                name: 'TUGO Team',
              },
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['Korean'],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
