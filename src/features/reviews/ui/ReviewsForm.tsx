'use client';

import { useState } from 'react';
import { createReview } from '../api/api';
import { ReviewFormProps, Review } from '../model/model';
import { useUserStore } from '@/shared/auth/useUserStore';

export default function ReviewForm({ 
  productId, 
  onCancel, 
  onReviewCreated
}: ReviewFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { realName } = useUserStore();

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await createReview(productId, content.trim());
      console.log('리뷰 작성 성공:', response);
      
      // 새로운 리뷰 객체 생성
      const newReview: Review = {
        id: response.data,
        content: content.trim(),
        productId,
        writer: {
          id: 0, // ID는 사용하지 않음
          name: realName || '익명'
        }
      };
      
      setContent('');
      
      if (onReviewCreated) {
        onReviewCreated(newReview);
      }
      
      alert('리뷰가 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-3">후기 작성</h3>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="상품에 대한 후기를 작성해주세요..."
        className="w-full h-24 p-3 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={500}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">
          {content.length}/500자
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors  cursor-pointer"
            disabled={submitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50  cursor-pointer"
            disabled={submitting || !content.trim()}
          >
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
