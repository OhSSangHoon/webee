import { BeeType } from '@/shared/types/beeSwitch';

/**
 * 재배 방식 타입
 */
export type CultivationType = "CONTROLLED" | "GREENHOUSE" | "OUTDOOR" | "INDOOR" | "FACILITY" | "FIELD" | "OPEN_FIELD";

/**
 * 기본 벌 추천 타입
 */
export type BeeRecommendation = {
  beeRecommendationId: number;
  beeType: BeeType;
  inputStartDate: string;
  inputEndDate: string;
  cropName: string;
  cultivationAddress: string;
  cultivationType: CultivationType;
  createdAt: string;
};

/**
 * 벌 추천 상세 타입 (기본 정보 + 추가 상세 정보)
 */
export type BeeRecommendationDetail = BeeRecommendation & {
  characteristics: string;
  caution: string;
  usageTip: string;
};

/**
 * 벌 추천 리스트 응답 타입
 */
export type BeeRecommendationListResponse = {
  code: string;
  message: string;
  data: BeeRecommendation[];
};

/**
 * 벌 추천 상세 응답 타입
 */
export type BeeRecommendationDetailResponse = {
  code: string;
  message: string;
  data: BeeRecommendationDetail;
};

/**
 * 벌 추천 스토어 상태 타입
 */
export type BeeRecommendationState = {
  list: BeeRecommendation[] | null;
  detailMap: Record<number, BeeRecommendationDetail>;
  loading: boolean;
  error: string | null;
};