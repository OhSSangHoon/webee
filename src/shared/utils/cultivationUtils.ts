/**
 * 재배 방식 타입 정의
 */
export type CultivationType = "CONTROLLED" | "OPEN_FIELD";

/**
 * API의 실제 값에 맞는 재배방식 변환
 */
export const getCultivationTypeKorean = (type: string): string => {
  switch (type) {
    case "CONTROLLED":
      return "시설재배";
    case "OPEN_FIELD":
      return "노지";
    default:
      return type || "정보 없음";
  }
};
