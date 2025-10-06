/**
 * 라우트 보안 설정
 */

export const RouteConfig = {
  /**
   * 완전 공개 페이지 (인증 불필요, 제약 없음)
   */
  PUBLIC_ROUTES: [
    '/login',
    '/about',
    '/terms',
    '/privacy',
    '/help',
    '/contact',
  ],

  /**
   * SEO 프리뷰 페이지 (일정 시간 후 로그인 팝업, 상호작용 시 로그인 필수)
   */
  SEO_PREVIEW_ROUTES: ['/profile'],

  /**
   * 엄격한 보호 페이지 (즉시 로그인 페이지로 리다이렉트)
   */
  STRICT_PROTECTED_ROUTES: [
    '/messages',
    '/notifications',
    '/account',
    '/points',
    '/',
    '/parties',
  ],

  /**
   * 로그인 유도 팝업이 나타나기까지의 시간 (밀리초)
   */
  LOGIN_PROMPT_DELAY: 10000, // 10초
} as const;

/**
 * 주어진 경로가 어떤 타입의 라우트인지 확인
 */
export function getRouteType(
  pathname: string
): 'public' | 'seo-preview' | 'strict-protected' {
  // 완전 공개 페이지
  if (RouteConfig.PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return 'public';
  }

  // SEO 프리뷰 페이지 (프로필)
  if (
    RouteConfig.SEO_PREVIEW_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return 'seo-preview';
  }

  // 엄격한 보호 페이지 (나머지 모든 페이지)
  return 'strict-protected';
}
