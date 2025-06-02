// shared/business/model.ts
import { create } from "zustand";
import { getBusinessList, getBusinessDetail, BusinessSummary, BusinessDetail } from "./api";

interface BusinessStore {
  list: BusinessSummary[];
  detail: BusinessDetail | null;
  fetchList: () => Promise<void>;
  fetchDetail: (businessId: number) => Promise<void>;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  list: [],
  detail: null,

  fetchList: async () => {
    try {
      const data = await getBusinessList();
      set({ list: data });
    } catch (error) {
      console.error("업체 목록 조회 실패:", error);
    }
  },

  fetchDetail: async (businessId: number) => {
    try {
      const data = await getBusinessDetail(businessId);
      set({ detail: data });
      console.log("내 업체 상세조회 성공:", data);
    } catch (error) {
      console.error("업체 상세 조회 실패:", error);
    }
  },
}));
