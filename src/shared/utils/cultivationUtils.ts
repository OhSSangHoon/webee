/**
 * 재배 방식 타입 정의
 */
export type CultivationType = 
  | "CONTROLLED" 
  | "OPEN_FIELD" 
  | "GREENHOUSE" 
  | "INDOOR" 
  | "FACILITY" 
  | "OUTDOOR" 
  | "FIELD";

/**
 * API의 실제 값에 맞는 재배방식 변환
 */
export const getCultivationTypeKorean = (type: string): string => {
  switch (type) {
    case "CONTROLLED":
      return "시설재배";     // 통제된 환경
    case "OPEN_FIELD":
      return "노지";         // 노지 재배
    case "GREENHOUSE":
    case "INDOOR":
    case "FACILITY":
      return "하우스";       // 시설 재배
    case "OUTDOOR":
    case "FIELD":
      return "노지";         // 노지 재배
    default:
      return type || "정보 없음";
  }
};

/**
 * 더 간단한 매핑 (객체 방식)
 */
export const getCultivationTypeSimple = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'CONTROLLED': '시설재배',
    'OPEN_FIELD': '노지',
    'OUTDOOR': '노지', 
    'FIELD': '노지',
    'GREENHOUSE': '하우스',
    'INDOOR': '하우스',
    'FACILITY': '하우스'
  };
  
  return typeMap[type] || type || '정보 없음';
};

/**
 * 재배방식 아이콘 매핑
 */
export const getCultivationTypeIcon = (type: string): string => {
  switch (type) {
    case "CONTROLLED":
      return "🏭"; // 시설재배
    case "OPEN_FIELD":
    case "OUTDOOR":
    case "FIELD":
      return "🌾"; // 노지
    case "GREENHOUSE":
    case "INDOOR":
    case "FACILITY":
      return "🏠"; // 하우스
    default:
      return "🌱"; // 기본
  }
};