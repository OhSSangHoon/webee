"use client";

import { useState } from "react";
import { BeeRecommendation, BeeRecommendationDetail } from "./types";
import {
  fetchRecommendations,
  fetchRecommendationDetail,
} from "../api/api";

export const useBeeRecommendationStore = () => {
  const [list, setList] = useState<BeeRecommendation[] | null>(null);
  const [detailMap, setDetailMap] = useState<Record<number, BeeRecommendationDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadList = async () => {
    if (list === null) {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecommendations();
        setList(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "목록을 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("벌 추천 목록 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadDetail = async (id: number) => {
    if (!detailMap[id]) {
      try {
        setError(null);
        const detail = await fetchRecommendationDetail(id);
        setDetailMap((prev) => ({ ...prev, [id]: detail }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "상세 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("벌 추천 상세 로딩 실패:", err);
      }
    }
  };

  return {
    list,
    detailMap,
    loading,
    error,
    loadList,
    loadDetail,
  };
};