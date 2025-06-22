'use client';

import { useState } from 'react';
import { Review } from '../model/model';
import { useInfiniteReviewsAdapter } from '../model/useInfiniteReviews';
import ReviewForm from './ReviewsForm';
import ReviewList from './ReviewsList';
import { useUserStore } from '@/shared/auth/useUserStore';

interface ReviewSectionProps {
  productId: number;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  
  const { isLoggedIn } = useUserStore();

  const {
    reviews,
    totalReviews,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    invalidateReviews,
    handleEditReview,
    handleDeleteReview
  } = useInfiniteReviewsAdapter(productId); // SSR 관련 모든 코드 제거

  // 새 리뷰 작성 완료 후 처리
  const handleReviewCreated = async (newReview: Review) => {
    console.log('새 리뷰 작성 완료, 강력한 새로고침 시작');
    setShowForm(false);
    invalidateReviews();
  };

  const handleCancelReview = () => {
    setShowForm(false);
  };

  const loadMoreReviews = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          후기 
          {totalReviews > 0 && (
            <span className="text-base font-normal text-gray-500 ml-2">
              ({totalReviews.toLocaleString()}개)
            </span>
          )}
        </h2>
        
        {/* 로그인한 사용자만 리뷰 작성 가능 */}
        {isLoggedIn ? (
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={showForm}
          >
            후기작성
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            리뷰 작성은 로그인 후 이용 가능합니다.
          </div>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      {showForm && isLoggedIn && (
        <ReviewForm
          productId={productId}
          onReviewCreated={handleReviewCreated}
          onCancel={handleCancelReview}
        />
      )}

      {/* 리뷰 목록 */}
      <ReviewList
        reviews={reviews}
        loading={isLoading}
        error={error}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMore={loadMoreReviews}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  );
}