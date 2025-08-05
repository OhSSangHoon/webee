/**
 * 벌 종류 타입 (통합)
 */
export type BeeType = "HONEYBEE" | "BUMBLEBEE" | "MASON_BEE";

/**
 * 벌 종류 한글 변환 함수
 */
export const getBeeTypeKorean = (beeType: string) => {
  switch (beeType) {
    case "HONEYBEE":
      return "꿀벌";
    case "BUMBLEBEE":
      return "뒤영벌";
    case "MASON_BEE":
      return "머리뿔가위벌";
    default:
      return beeType;
  }
};

/**
 * 한글 → 영어 변환 함수
 */
export const getBeeTypeEnglish = (koreanType: string): BeeType => {
  switch (koreanType) {
    case "꿀벌":
      return "HONEYBEE";
    case "뒤영벌":
      return "BUMBLEBEE";
    case "머리뿔가위벌":
      return "MASON_BEE";
    default:
      return koreanType as BeeType;
  }
};

/**
 * 벌 타입들이 동일한지 확인
 */
export const isSameBeeType = (type1: string, type2: string): boolean => {
  const normalized1 = getBeeTypeEnglish(type1);
  const normalized2 = getBeeTypeEnglish(type2);
  return normalized1 === normalized2;
};

/**
 * 추천된 벌 타입과 매칭되는 상품들 필터링
 */
export const filterProductsByBeeType = <T extends { beeType: string }>(
  products: T[],
  recommendedBeeType: string
): T[] => {
  return products.filter((product) =>
    isSameBeeType(product.beeType, recommendedBeeType)
  );
};

/**
 * 모든 벌 타입 목록 (한글)
 */
export const ALL_BEE_TYPES_KR = ["꿀벌", "뒤영벌", "머리뿔가위벌"] as const;

/**
 * 모든 벌 타입 목록 (영어)
 */
export const ALL_BEE_TYPES_EN: BeeType[] = [
  "HONEYBEE",
  "BUMBLEBEE",
  "MASON_BEE",
];

//벌 질병 한글 변환 함수
export const getBeeDiseaseKorean = (beeDisease: string): string => {
  switch (beeDisease) {
    case "LARVA_FOULBROOD":
      return "유충 부저병";
    case "LARVA_SACBROOD":
      return "유충 석고병";
    case "ADULT_VARROA_MITE":
      return "성충 응애";
    case "LARVA_VARROA_MITE":
      return "유충 응애";
    case "ADULT_WING_DEFORMITY_VIRUS":
      return "성충 날개불구바이러스감염증";
    default:
      return "알 수 없는 질병";
  }
};
