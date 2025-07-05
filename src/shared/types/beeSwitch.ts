// 벌 종류 한글 변환 함수
export const getBeeTypeKorean = (beeType: string) => {
  switch (beeType) {
    case "HONEYBEE":
      return "꿀벌";
    case "BUMBLEBEE":
      return "뒤엉벌(호박벌)";
    case "MASON_BEE":
      return "머리뿔가위벌";
    default:
      return beeType;
  }
};
