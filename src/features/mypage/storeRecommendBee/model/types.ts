export type BeeRecommendation = {
  beeRecommendationId: number;
  beeType: string;
  inputStartDate: string;
  inputEndDate: string;
  cropName: string;
  cultivationAddress: string;
  cultivationType: string;
  createdAt: string;
};

export type BeeRecommendationDetail = BeeRecommendation & {
  characteristics: string;
  caution: string;
  usageTip: string;
};
