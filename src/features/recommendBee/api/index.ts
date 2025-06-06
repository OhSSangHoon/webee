import { CropFormDataForRecommend } from "@/shared/types/crop";

import api from "@/shared/auth/lib";

export async function postRecommendation(data: CropFormDataForRecommend) {
  try {
    const response = await api.post("bee/recommendations/ai", data);
    console.table(response.data);
    return response.data;
  } catch (error) {
    console.error("추천 실패:", error);
    return null;
  }
}
