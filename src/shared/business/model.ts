import { create } from "zustand";
import {
  getBusinessList,
  getBusinessDetail,
  BusinessSummary,
  BusinessDetail,
} from "./api";

interface BusinessStore {
  list: BusinessSummary[];
  detailsById: Record<number, BusinessDetail>; // ✅ 캐시용 객체
  selectedDetail: BusinessDetail | null;
  fetchList: () => Promise<void>;
  fetchDetail: (businessId: number) => Promise<void>;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  list: [],
  detailsById: {},
  selectedDetail: null,

  fetchList: async () => {
    try {
      const data = await getBusinessList();
      set({ list: data });
    } catch (error) {
      console.error("업체 목록 조회 실패:", error);
    }
  },

  fetchDetail: async (businessId: number) => {
    const cache = get().detailsById;

    // ✅ 이미 불러온 데이터면 캐시에서 사용하고 API 호출 스킵
    if (cache[businessId]) {
      set({ selectedDetail: cache[businessId] });
      return;
    }

    try {
      const data = await getBusinessDetail(businessId);
      set((state) => ({
        detailsById: {
          ...state.detailsById,
          [businessId]: data,
        },
        selectedDetail: data,
      }));
    } catch (error) {
      console.error("업체 상세 조회 실패:", error);
    }
  },
}));
