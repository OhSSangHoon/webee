// 수정벌 추천 훅 
import { create } from "zustand";
import { CropFormDataForRecommend, BeeResult } from "@/shared/types/crop";
import { postRecommendation } from "../api";

type RecommendBeeState = {
  resultData: BeeResult;
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
  cropName: string;
  cultivationAddress: string;
  cultivationType: string;
  submitCropInfo: (formData: CropFormDataForRecommend) => Promise<void>;
};

// zustand로 추천 내용 관리 
export const useRecommendBee = create<RecommendBeeState>((set) => ({
  resultData: {
    beeType: "서양 뒤영벌",
    inputStartDate: "2025-05-11",
    inputEndDate: "2025-05-15",
    characteristics: [
      "온순한 성질로 관리 용이",
      "질병 저항성이 강함",
      "분봉성이 적어 관리 편리",
    ],
    caution: [
      "온도 25도 이상에서 투입 권장",
      "투입 전 여왕벌 수용율 확인 필요",
      "투입 후 3일간 벌통 개방 자제",
    ],
    usageTip: [
      "투입 2시간 전 벌꿀물을 뿌려주면 수용률이 높아집니다.",
      "투입 시간은 오후 4~6시 사이가 가장 적합합니다.",
      "투입 후 첫 1주일은 소량의 설탕물을 공급해 주세요.",
    ],
  },
  loading: false,
  error: null,
  isSuccess: false,
  cropName: "",
  cultivationAddress: "",
  cultivationType: "CONTROLLED",
  submitCropInfo: async (formData: CropFormDataForRecommend) => {
    set({
      loading: true,
      error: null,
      isSuccess: false,
      cropName: formData.name,
      cultivationAddress: formData.cultivationAddress,
      cultivationType: formData.cultivationType,
       // 작물 정보는 formData에서 가져옴. 추후 추천 내용 저장 시 필요한 정보.  
    });
    try {
      const response = await postRecommendation(formData);
      if (response?.data) {
        set({ resultData: response.data, isSuccess: true });
        console.log("API 결과 수신:", response.data);
      }
    } catch (err) {
      console.error("추천 실패:", err);
      set({ error: "추천에 실패했습니다." });
    } finally {
      set({ loading: false });
    }
  },
}));
