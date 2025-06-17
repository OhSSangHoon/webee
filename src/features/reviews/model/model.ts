// 기본 리뷰 타입
export interface Review {
  id: number;
  content: string;
  productId: number;
  writer: {
    id: number;
    nickname: string;
  };
}

// 기본 리뷰 응답 타입
export interface ReviewResponse {
  code: string;
  message: string;
  data: Review[];
}

// 리뷰 생성 응답 타입
export interface CreateReviewResponse {
  code: string;
  message: string;
  data: number; // 생성된 리뷰 ID
}

// 리뷰 수정 응답 타입
export interface UpdateReviewResponse {
  code: string;
  message: string;
  data: string; // 응답 메시지
}

// 리뷰 삭제 응답 타입
export interface DeleteReviewResponse {
  code: string;
  message: string;
  data: string; // 응답 메시지
}

// 리뷰 작성 폼 Props
export interface ReviewFormProps {
  productId: number;
  onCancel: () => void;
  onReviewCreated?: (newReview: Review) => void;
}

// 리뷰 목록 Props (무한스크롤 포함)
export interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
  onEditReview: (reviewId: number, newContent: string) => void;
  onDeleteReview: (reviewId: number) => void;
}