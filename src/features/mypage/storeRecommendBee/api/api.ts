import api from "@/shared/auth/lib";
import { 
  BeeRecommendation, 
  BeeRecommendationDetail,
  BeeRecommendationListResponse,
  BeeRecommendationDetailResponse 
} from "../model/types";

/**
 * 꿀벌 추천 목록을 가져오는 API 함수
 */
export async function fetchRecommendations(): Promise<BeeRecommendation[]> {
  try {
    const response = await api.get<BeeRecommendationListResponse>("/bee/recommendations");
    console.log("벌 추천 목록 조회 성공:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("벌 추천 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 꿀벌 추천 상세 정보를 가져오는 API 함수
 */
export async function fetchRecommendationDetail(id: number): Promise<BeeRecommendationDetail> {
  try {
    const response = await api.get<BeeRecommendationDetailResponse>(`/bee/recommendations/${id}`);
    console.log("벌 추천 상세 조회 성공:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("벌 추천 상세 조회 실패:", error);
    throw error;
  }
}