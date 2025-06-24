import { BeeResult } from "@/shared/types/crop";
import { saveRecommendation } from "../api";
import { useRecommendBee } from "./useRecommendation";

export type BeeResultForServer = Omit<
  BeeResult,
  "characteristics" | "caution" | "usageTip"
> & {
  characteristics: string;
  caution: string;
  usageTip: string;
  cropName: string;
  cultivationAddress: string;
  cultivationType: string;
};

// 벌 타입 변환.
const beeTypeMap: Record<string, string> = {
  "서양 뒤영벌": "EUROPEAN_BUMBLEBEE",
  "국산 뒤영벌": "ASIAN_BUMBLEBEE",
  꿀벌: "HONEYBEE",
  머리뿔가위벌: "MASON_BEE",
};

//  줄바꿈 문자열 처리를 통한 string[] -> string.
export const transformDataForServer = (
  data: BeeResult,
  cropName: string,
  cultivationAddress: string,
  cultivationType: string
): BeeResultForServer => ({
  ...data,
  beeType: beeTypeMap[data.beeType] ?? data.beeType,
  inputStartDate: data.inputStartDate.replace(/\./g, "-"),
  inputEndDate: data.inputEndDate.replace(/\./g, "-"),
  characteristics: data.characteristics.join("\n"),
  caution: data.caution.join("\n"),
  usageTip: data.usageTip.join("\n"),
  cropName,
  cultivationAddress,
  cultivationType,
});

export const useSaveRecommendation = (
  resultData: BeeResult,
  setIsSave: React.Dispatch<React.SetStateAction<string>>
) => {
  const { cultivationAddress, cropName, cultivationType } = useRecommendBee();

  const save = async () => {
    try {
      const mappedData = transformDataForServer(
        resultData,
        cropName,
        cultivationAddress,
        cultivationType
      );
      const response = await saveRecommendation(mappedData);
      setIsSave(response);
      console.log("저장 직전 데이터:", mappedData);
    } catch (error) {
      console.log("수정벌 추천 실패", error);
    }
  };

  return save;
};
