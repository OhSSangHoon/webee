
import api from "@/shared/auth/lib";
import { BeeRecommendation } from "../model/types";

// 꿀벌 추천 목록을 가져오는 API 함수
export async function fetchRecommendations(): Promise<BeeRecommendation[]> {
  const response = await api.get("bee/recommendations");
  return response.data.data;
}


// 꿀벌 추천 상세 정보를 가져오는 API 함수
import { BeeRecommendationDetail } from "../model/types";

export async function fetchRecommendationDetail(id: number): Promise<BeeRecommendationDetail> {
  const response = await api.get(`/bee/recommendations/${id}`);
  return response.data.data;
}
