export interface CropFormData {
  crop: string;
  variety: string;
  cultivationType: string;
  location: string;
  area: string;
  plantingDate: string;
}

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
