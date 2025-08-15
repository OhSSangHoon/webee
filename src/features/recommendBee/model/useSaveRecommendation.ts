import { BeeResult } from "@/shared/types/crop";
import { useRecommendBee } from "./useRecommendation";
import { saveRecommendation } from "../api/recommendApi";
import { getBeeTypeEnglish } from "@/shared/types/beeSwitch";

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

// 줄바꿈 문자열 처리를 통한 string[] -> string.
export const transformDataForServer = (
  data: BeeResult,
  cropName: string,
  cultivationAddress: string,
  cultivationType: string
): BeeResultForServer => ({
  ...data,
  beeType: getBeeTypeEnglish(data.beeType),
  inputStartDate: data.inputStartDate.replace(/\./g, "-"),
  inputEndDate: data.inputEndDate.replace(/\./g, "-"),
  characteristics: data.characteristics.join("\n"),
  caution: data.caution.join("\n"),
  usageTip: data.usageTip.join("\n"),
  cropName,
  cultivationAddress,
  cultivationType,
});

// 추천 결과 저장
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
    } catch (error) {
    }
  };

  return save;
};