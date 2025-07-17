"use client";

import React, { useEffect } from "react";
import { useBeeRecommendationStore } from "../model/store";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";

export const BeeRecommendationList = ({
  onSelect,
  setOpenModal,
}: {
  onSelect: (id: number) => void;
  setOpenModal: (value: boolean) => void;
}) => {
  const { list, loadList } = useBeeRecommendationStore();

  useEffect(() => {
    loadList();
  }, [loadList]);

  if (!list) return <p className="text-center py-4">불러오는 중...</p>;

  return (
    <div className="custom-box2 h-80 rounded-xl bg-white shadow-lg">
      <div className="custom-box2-title w-full text-xl font-semibold mb-2">
        🐝 수정벌 추천 리스트
      </div>

      <ul className="flex flex-row overflow-x-auto space-x-4 h-[80%] p-2">
        {list.map((item) => (
          <li
            key={item.beeRecommendationId}
            className="min-w-[260px] bg-white rounded-2xl p-4 drop-shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between items-start hover:scale-105 transform cursor-pointer"
            onClick={() => onSelect(item.beeRecommendationId)}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-lg font-bold text-gray-800">
                {getBeeTypeKorean(item.beeType)}
              </span>
              <span className="bg-pink-400 text-white text-xs px-2 py-1 rounded-full">
                추천
              </span>
            </div>

            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">작물명:</span> {item.cropName}
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">추천 투입일:</span> {item.createdAt}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                {item.cultivationType === "CONTROLLED" ? "노지" : "하우스"}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                {item.cultivationAddress}
              </span>
            </div>

            <button
              className="mt-3 w-full py-1 bg-white border border-pink-400 text-pink-500 rounded-full text-sm font-medium hover:bg-pink-50 transition-colors duration-200 active:scale-95"
              onClick={(e) => {
                e.stopPropagation(); // 부모 클릭 방지
                onSelect(item.beeRecommendationId);
                setOpenModal(true);
              }}
            >
              상세 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
