'use client';

import { useEffect, useRef, useState } from 'react';
import { Review, ReviewListProps } from '../model/model';
import { updateReview, deleteReview } from '../api/api';
import { useUserStore } from '@/shared/auth/useUserStore';

export default function ReviewList({ 
  reviews, 
  loading, 
  error, 
  hasNextPage, 
  isFetchingNextPage, 
  loadMore,
  onEditReview,
  onDeleteReview
}: ReviewListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { realName, isLoggedIn } = useUserStore();

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // 닉네임 마스킹 함수
  const maskNickname = (nickname?: string) => {
    if (!nickname || nickname.length === 0) return '익명';
    if (nickname.length <= 2) {
      return nickname[0] + "*".repeat(nickname.length - 1);
    }
    return nickname[0] + "*".repeat(nickname.length - 2) + nickname[nickname.length - 1];
  };

  // 현재 사용자가 리뷰 작성자인지 확인 (userName 비교)
  const isAuthor = (review: Review) => {
    if (!isLoggedIn || !realName) return false;
    
    // 리뷰 작성자의 nickname과 현재 사용자의 userName 비교
    const reviewerNickname = review.writer?.name;
    
    // userName으로 정확히 비교 (userName이 고유하므로)
    return reviewerNickname === realName;
  };

  // 수정/삭제 함수들
  const startEdit = (reviewId: number, content: string) => {
    setEditingReviewId(reviewId);
    setEditContent(content);
  };

  const handleEditSubmit = async (reviewId: number) => {
    if (!editContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateReview(reviewId, editContent.trim());
      onEditReview(reviewId, editContent.trim());
      setEditingReviewId(null);
      alert('리뷰가 수정되었습니다.');
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditContent('');
  };

  const handleDelete = async (reviewId: number) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewId);
        onDeleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">에러: {error}</div>
        <button 
          onClick={loadMore}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">아직 작성된 후기가 없습니다.</div>
        <div className="text-sm text-gray-400 mt-1">첫 번째 후기를 작성해보세요!</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => {
        const content = review?.content || '내용이 없습니다.';
        const reviewId = review?.id || index;
        const isEditing = editingReviewId === reviewId;
        const writerNickname = review?.writer?.name || '익명';
        
        return (
          <div 
            key={`${reviewId}-${index}`} 
            className="flex space-x-4 p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100"
          >
            {/* 프로필 이미지 */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium overflow-hidden">
                {maskNickname(writerNickname)}
              </span>
            </div>

            {/* 리뷰 내용 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {maskNickname(writerNickname)}
                  </span>
                </div>

                {/* 수정/삭제 버튼 (작성자만 표시) */}
                {isAuthor(review) && !isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(reviewId, content)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(reviewId)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 리뷰 내용 또는 수정 폼 */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {editContent.length}/500자
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        disabled={isSubmitting}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleEditSubmit(reviewId)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={isSubmitting || !editContent.trim()}
                      >
                        {isSubmitting ? '수정 중...' : '수정'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {content}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* 로딩 더보기 인디케이터 */}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-500">더 많은 리뷰를 불러오는 중...</span>
          </div>
        </div>
      )}

      <div ref={observerTarget} className="h-4" aria-hidden="true" />

      {!hasNextPage && reviews.length > 0 && (
        <div className="text-center py-4">
          <span className="text-sm text-gray-500">
            모든 리뷰를 확인했습니다. (총 {reviews.length}개)
          </span>
        </div>
      )}
    </div>
  );
}