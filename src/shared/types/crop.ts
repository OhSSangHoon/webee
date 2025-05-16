export interface CropFormData {
  crop: string;
  variety: string;
  method: string;
  location: string;
  area: string;
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
