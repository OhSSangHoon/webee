"use client";

import { useState } from "react";
import { BeeRecommendation, BeeRecommendationDetail } from "./types";
import {
  fetchRecommendations,
  fetchRecommendationDetail,
} from "../api/fetchRecommendations";

export const useBeeRecommendationStore = () => {
  const [list, setList] = useState<BeeRecommendation[] | null>(null);
  const [detailMap, setDetailMap] = useState<
    Record<number, BeeRecommendationDetail>
  >({});

  const loadList = async () => {
    if (list === null) {
      const data = await fetchRecommendations();
      setList(data);
    }
  };

  const loadDetail = async (id: number) => {
    if (!detailMap[id]) {
      const detail = await fetchRecommendationDetail(id);
      setDetailMap((prev) => ({ ...prev, [id]: detail }));
    }
  };

  return {
    list,
    detailMap,
    loadList,
    loadDetail,
  };
};
