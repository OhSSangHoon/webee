import api from "@/shared/auth/lib";

export interface BusinessSummary {
  businessId: number;
  companyName: string;
  businessAddress: string;
  latitude: number;
  longitude: number;
}

export interface BusinessDetail extends BusinessSummary {
  businessAddress: string;
  registrationNumber: string;
  representativeName: string;
  commencementDate: string;
  phoneNumber: string;
  onlineStoreUrl?: string;
  kakaoChatUrl?: string;
  businessCertImageUrl?: string;
}

export async function getBusinessList(): Promise<BusinessSummary[]> {
  const res = await api.get("/profile/business");
  return res.data.data;
}

export async function getBusinessDetail(
  businessId: number
): Promise<BusinessDetail> {
  const res = await api.get(`/profile/business/${businessId}`);
  return res.data.data;
}
