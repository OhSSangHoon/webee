import api from "@/shared/auth/lib";
import axios from "axios";
import { ReviewResponse, CreateReviewResponse, UpdateReviewResponse, DeleteReviewResponse } from "../model/model";

// 공개 API 인스턴스 (인증 없음)
const publicApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 상품별 리뷰 목록 조회
export async function getProductReviews(productId: number): Promise<ReviewResponse> {
  try {
    console.log(`리뷰 조회 시작: productId=${productId}`);
    const response = await publicApi.get<ReviewResponse>(`/products/reviews/product/${productId}`);
    console.log('리뷰 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 조회 실패:', error);
    throw error;
  }
}

// 리뷰 생성
export async function createReview(productId: number, content: string): Promise<CreateReviewResponse> {
  try {
    console.log(`리뷰 작성: productId=${productId}, content=${content}`);
    const response = await api.post<CreateReviewResponse>(
      `/products/reviews/${productId}`, 
      { content }
    );
    console.log('리뷰 작성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
    throw error;
  }
}

// 리뷰 수정
export async function updateReview(reviewId: number, content: string): Promise<UpdateReviewResponse> {
  try {
    console.log(`리뷰 수정: reviewId=${reviewId}, content=${content}`);
    const response = await api.put<UpdateReviewResponse>(
      `/products/reviews/${reviewId}`, 
      { content }
    );
    console.log('리뷰 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
}

// 리뷰 삭제
export async function deleteReview(reviewId: number): Promise<DeleteReviewResponse> {
  try {
    console.log(`리뷰 삭제: reviewId=${reviewId}`);
    const response = await api.delete<DeleteReviewResponse>(`/products/reviews/${reviewId}`);
    console.log('리뷰 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
}