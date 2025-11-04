'use client';

import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리를 감지하는 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: '(min-width: 1024px)')
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 초기 값 설정
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    // 변경 감지 리스너
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 리스너 등록
    mediaQuery.addEventListener('change', handler);

    // 클린업
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Desktop 여부를 확인하는 훅 (lg 브레이크포인트: 1024px+)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
