'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createReview } from '../api/api';
import { ReviewFormProps, Review } from '../model/model';
import { useUserStore } from '@/shared/auth/useUserStore';

type ReviewFormValues = {
  content: string;
};

const schema = yup.object({
  content: yup
    .string()
    .required('리뷰 내용을 입력해주세요.')
    .max(500, '리뷰는 500자 이내로 작성해주세요.')
    .trim()
});

export default function ReviewForm({ 
  productId, 
  onCancel, 
  onReviewCreated
}: ReviewFormProps) {
  const { realName } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<ReviewFormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const content = watch('content', '');

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      const response = await createReview(productId, data.content.trim());
      
      // 새로운 리뷰 객체 생성
      const newReview: Review = {
        id: response.data,
        content: data.content.trim(),
        productId,
        writer: {
          id: 0, // ID는 사용하지 않음
          name: realName || '익명'
        }
      };
      
      reset();
      
      if (onReviewCreated) {
        onReviewCreated(newReview);
      }
      
      alert('리뷰가 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-3">후기 작성</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register('content')}
          placeholder="상품에 대한 후기를 작성해주세요..."
          className="w-full h-24 p-3 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={500}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">
            {content?.length || 0}/500자
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
