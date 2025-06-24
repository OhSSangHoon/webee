// 벌 종류 한글 변환 함수
export const getBeeTypeKorean = (beeType: string) => {
  switch (beeType) {
    case "HONEYBEE":
      return "꿀벌";
    case "ASIAN_BUMBLEBEE":
      return "국산 호박벌";
    case "EUROPEAN_BUMBLEBEE":
      return "서양 호박벌";
    case "MASON_BEE":
      return "머리뿔가위벌";
    default:
      return beeType;
  }
};
