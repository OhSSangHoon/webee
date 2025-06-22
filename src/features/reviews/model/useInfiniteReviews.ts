import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getProductReviews } from '../api/api';
import { Review } from './model';

// API 응답 타입 정의
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 페이지네이션 응답 타입 정의
interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 페이지네이션된 API 응답 타입
type PaginatedApiResponse = ApiResponse<PageData<Review>>;

// 원본 API 응답 타입 (리뷰 배열)
type OriginalApiResponse = ApiResponse<Review[]>;

// 현재 API 응답을 페이징 구조로 변환하는 어댑터
function adaptApiResponseToPagination(
  apiResponse: OriginalApiResponse, 
  page: number, 
  size: number = 10
): PaginatedApiResponse {
  const reviews: Review[] = apiResponse.data || [];
  
  // 페이지별로 데이터 분할
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const pageContent = reviews.slice(startIndex, endIndex);
  
  return {
    code: apiResponse.code,
    message: apiResponse.message,
    data: {
      content: pageContent,
      totalElements: reviews.length,
      totalPages: Math.ceil(reviews.length / size),
      size: size,
      number: page,
      numberOfElements: pageContent.length,
      first: page === 0,
      last: endIndex >= reviews.length,
      empty: pageContent.length === 0
    }
  };
}

export function useInfiniteReviewsAdapter(productId: number) {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['reviews-infinite', productId],
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedApiResponse> => {
      console.log(`리뷰 무한스크롤 조회: productId=${productId}, page=${pageParam}`);
      
      // 전체 데이터를 한 번만 가져오기 (첫 페이지에서만)
      if (pageParam === 0) {
        const apiResponse = await getProductReviews(productId);
        console.log('API 원본 응답:', apiResponse);
        
        // 전체 데이터를 QueryClient에 캐시
        queryClient.setQueryData(['reviews-full', productId], apiResponse);
        
        return adaptApiResponseToPagination(apiResponse, pageParam, 10);
      } else {
        // 이후 페이지는 캐시된 데이터에서 분할
        const cachedData = queryClient.getQueryData<OriginalApiResponse>(['reviews-full', productId]);
        if (cachedData) {
          return adaptApiResponseToPagination(cachedData, pageParam, 10);
        } else {
          // 캐시가 없으면 다시 가져오기
          const apiResponse = await getProductReviews(productId);
          queryClient.setQueryData(['reviews-full', productId], apiResponse);
          return adaptApiResponseToPagination(apiResponse, pageParam, 10);
        }
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginatedApiResponse) => {
      const pageData = lastPage.data;
      console.log('다음 페이지 확인:', { 
        current: pageData.number, 
        isLast: pageData.last,
        total: pageData.totalPages 
      });
      
      return !pageData.last ? pageData.number + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,    // 5분
    refetchOnMount: true,
  });

  // 모든 페이지의 리뷰를 하나의 배열로 합치기
  const allReviews: Review[] = data?.pages.flatMap(page => page.data.content) ?? [];
  
  // 총 리뷰 개수
  const totalReviews = data?.pages[0]?.data.totalElements ?? 0;

  // 리뷰 목록 무효화
  const invalidateReviews = () => {
    queryClient.removeQueries({ queryKey: ['reviews-infinite', productId] });
    queryClient.removeQueries({ queryKey: ['reviews-full', productId] });
  };

  // 리뷰 수정 (캐시 업데이트)
  const updateReviewInCache = (reviewId: number, newContent: string) => {
    // 캐시된 전체 데이터 업데이트
    queryClient.setQueryData<OriginalApiResponse>(['reviews-full', productId], (oldData) => {
      if (!oldData || !oldData.data) return oldData;
      
      return {
        ...oldData,
        data: oldData.data.map((review: Review) => 
          review.id === reviewId 
            ? { ...review, content: newContent }
            : review
        )
      };
    });
    
    // 무한스크롤 데이터도 업데이트
    queryClient.setQueryData<{ pages: PaginatedApiResponse[]; pageParams: unknown[] }>(
      ['reviews-infinite', productId], 
      (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        
        const newPages = oldData.pages.map((page: PaginatedApiResponse) => ({
          ...page,
          data: {
            ...page.data,
            content: page.data.content.map((review: Review) => 
              review.id === reviewId 
                ? { ...review, content: newContent }
                : review
            )
          }
        }));
        
        return {
          ...oldData,
          pages: newPages
        };
      }
    );
  };

  // 리뷰 삭제 (캐시에서 제거)
  const removeReviewFromCache = (reviewId: number) => {
    // 캐시된 전체 데이터 업데이트
    queryClient.setQueryData<OriginalApiResponse>(['reviews-full', productId], (oldData) => {
      if (!oldData || !oldData.data) return oldData;
      
      return {
        ...oldData,
        data: oldData.data.filter((review: Review) => review.id !== reviewId)
      };
    });
    
    // 무한스크롤 데이터도 업데이트
    queryClient.setQueryData<{ pages: PaginatedApiResponse[]; pageParams: unknown[] }>(
      ['reviews-infinite', productId], 
      (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        
        const newPages = oldData.pages.map((page: PaginatedApiResponse) => ({
          ...page,
          data: {
            ...page.data,
            content: page.data.content.filter((review: Review) => review.id !== reviewId),
            totalElements: Math.max(0, page.data.totalElements - 1)
          }
        }));
        
        return {
          ...oldData,
          pages: newPages
        };
      }
    );
  };

  // 리뷰 수정 핸들러
  const handleEditReview = (reviewId: number, newContent: string) => {
    updateReviewInCache(reviewId, newContent);
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewId: number) => {
    removeReviewFromCache(reviewId);
  };

  return {
    reviews: allReviews,
    totalReviews,
    error: error?.message || null,
    isLoading: status === 'pending',
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    invalidateReviews,
    handleEditReview,
    handleDeleteReview
  };
}