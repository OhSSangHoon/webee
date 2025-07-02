import { CropFormDataForRecommend } from "@/shared/types/crop";

import api from "@/shared/auth/lib";
import { BeeResultForServer } from "../model/useSaveRecommendation";

// 수정벌 추천 api
export async function postRecommendation(data: CropFormDataForRecommend) {
  try {
    const response = await api.post("bee/recommendations/ai", data);
    return response.data;
  } catch (error) {
    return error;
  }
}

// 수정벌 추천 결과 저장 api
export async function saveRecommendation(data: BeeResultForServer) {
  try {
    await api.post("/bee/recommendations", data);
    return "저장 완료! 마이페이지 > 수정벌 추천 리스트에서 확인 가능합니다.";
  } catch (error) {
    console.error("API 오류:", error);
    return "오류가 발생했어요. 다시 시도해보세요.";
  }
}
