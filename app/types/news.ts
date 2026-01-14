/**
 * 뉴스 기사 타입
 */
export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  imageUrl: string | null;
  description: string | null;
}

/**
 * 뉴스 카테고리 타입
 */
export interface NewsCategory {
  id: string; // 'politics' | 'economy' | 'society'
  name: string; // '정치' | '경제' | '사회'
  hasSourceFilter: boolean; // 언론사 필터 지원 여부
}
