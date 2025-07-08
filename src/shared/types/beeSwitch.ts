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

//벌 질병 한글 변환 함수
export const getBeeDiseaseKorean = (beeDisease: string): string => {
  switch (beeDisease) {
    case "LARVA_FOULBROOD":
      return "유충 부저병";
    case "LARVA_SACBROOD":
      return "유충 석고병";
    case "ADULT_VARROA_MITE":
      return "성충 응애";
    case "ADULT_WING_DEFORMITY_VIRUS":
      return "성충 날개불구바이러스감염증";
    default:
      return "알 수 없는 질병";
  }
};
