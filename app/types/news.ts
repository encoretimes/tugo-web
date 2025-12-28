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
