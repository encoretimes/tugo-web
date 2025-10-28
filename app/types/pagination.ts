export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page number (0-indexed)
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * 무한 스크롤용 페이지 파라미터
 */
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
