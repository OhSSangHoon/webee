import api from "@/shared/auth/lib";
import { CropAddressResponse } from "../model/types";

/**
 * 프로필 관련 API
 */
export const profileApi = {
  /**
   * 사용자 작물 재배지 목록 조회
   */
  getCropAddresses: async (): Promise<string[]> => {
    try {
      const response = await api.get<CropAddressResponse>("/profile/crops/addresses");
      console.log("재배지 목록 조회 성공:", response.data);
      return response.data.data.address;
    } catch (error) {
      console.error("재배지 목록 조회 오류:", error);
      return [];
    }
  },
};