export enum CultivationMethod {
  OPEN_FIELD = "노지",
  GREENHOUSE = "비닐하우스"
}

export enum CultivationType {
  CONTROLLED = "CONTROLLED",
  OPEN_FIELD = "OPEN_FIELD"
}

export interface CropFormData {
  crop: string;
  variety: string;
  cultivationType: string;
  method: CultivationMethod;
  location: string;
  area: string;
  plantingDate: string;
}


export const getCultivationType = (method: CultivationMethod): CultivationType => {
  switch (method) {
    case CultivationMethod.GREENHOUSE:
      return CultivationType.CONTROLLED;
    case CultivationMethod.OPEN_FIELD:
    default:
      return CultivationType.OPEN_FIELD;
  }
};

export interface CropFormDataForRecommend {
  name: string;
  variety: string;
  cultivationType: string;
  cultivationAddress: string;
  cultivationArea: string;
  plantingDate: string;
}

export interface Crop {
  id: number;
  name: string;
  description: string;
  variety?: string;
  cultivationType?: string;
  cultivationAddress?: string;
  cultivationArea?: number;
  plantingDate?: string;
}

export interface BeeResult {
  beeType: string;
  inputStartDate: string;
  inputEndDate: string;
  characteristics: string[];
  caution: string[];
  usageTip: string[];
}
