"use client";

import api from "@/shared/auth/lib";
import { Crop } from "@/shared/types/crop";

// 작물 전체 정보 조회
export const getCropInfo = async (): Promise<Crop[]> => {
  try {
    const res = await api.get("/profile/crops");
    return res.data.data;
  } catch (e) {
    console.error("작물 정보 조회 오류:", e);
    return [];
  }
};

// 작물 상세 정보 조회 - 사용 안 함
export const getCropInfoById = async (id: number): Promise<Crop | null> => {
  try {
    const res = await api.get(`/profile/crops/${id}`);
    return res.data.data;
  } catch (e) {
    console.error("상세 조회 오류:", e);
    return null;
  }
};

// 작물 정보 수정
export const updateCropInfo = async (id: number, data: Partial<Crop>) => {
  try {
    const res = await api.put(`/profile/crops/${id}`, data);
    return res.data;
  } catch (e) {
    console.error("수정 오류:", id, data, e);
  }
};
// 작물 정보 삭제
export const deleteCropInfo = async (id: number) => {
  try {
    await api.delete(`/profile/crops/${id}`);
  } catch (e) {
    console.error("삭제 오류:", e);
  }
};
