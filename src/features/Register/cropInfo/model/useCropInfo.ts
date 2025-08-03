import { useState } from "react";
import { CropFormData } from "@/shared/types/crop";
import { PostCropInfo } from "../api";
export function useCropInfo() {
  const { postCropInfo } = PostCropInfo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCropInfo = async (formData: CropFormData) => {
    setLoading(true);
    setError(null);
    try {
      await postCropInfo(formData);
      setError(
        "작물이 등록되었습니다. 수정벌 추천 > 작물 정보 가져오기에서 저장 내용을 확인하실 수 있습니다. "
      );
      console.log("작물 등록 성공:", formData);
      return true;
    } catch (error) {
      setError("작물 등록에 실패했습니다.");
      console.error("작물 등록 오류:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitCropInfo,
    loading,
    error,
  };
}
