import { useCallback } from "react";
import { CropFormData } from "@/shared/types/crop";
import api from "@/shared/auth/lib";

// 작물 정보 등록
export const PostCropInfo = () => {
  const postCropInfo = useCallback(async (data: CropFormData) => {
    try {
      const response = await api.post("profile/crops", {
        name: data.crop,
        variety: data.variety,
        cultivationType:
          data.method === "비닐하우스" ? "CONTROLLED" : "OPEN_FIELD",
        cultivationAddress: data.location,
        cultivationArea: Number(data.area),
        plantingDate: data.plantingDate,
      });
      console.log("작물 정보 등록 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("작물 정보 등록 오류:", error);
      throw error;
    }
  }, []);

  return { postCropInfo };
};

