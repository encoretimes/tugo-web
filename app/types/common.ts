// Pagination Types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page number (0-indexed)
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort?: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset?: number;
    paged?: boolean;
    unpaged?: boolean;
  };
}

/**
 * 무한 스크롤용 페이지 파라미터
 */
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

// Party Types
export interface Party {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  bannerImageUrl: string;
  isJoined?: boolean;
}
