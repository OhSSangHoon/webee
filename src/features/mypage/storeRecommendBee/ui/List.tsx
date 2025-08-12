"use client";

import React, { useEffect } from "react";
import { useBeeRecommendationStore } from "../model/store";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { BeeRecommendation } from "../model/types";
import { getCultivationTypeKorean } from "@/shared/utils/cultivationUtils";

interface BeeRecommendationListProps {
  onSelect: (id: number) => void;
  setOpenModal: (value: boolean) => void;
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD -> MM/DD)
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } catch {
    return dateString;
  }
};

export const BeeRecommendationList: React.FC<BeeRecommendationListProps> = ({
  onSelect,
  setOpenModal,
}) => {
  const { list, loading, error, loadList } = useBeeRecommendationStore();

  useEffect(() => {
    loadList();
  }, [loadList]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="custom-box2 shadow-lg">
        <div className="custom-box2-title w-full text-xl font-semibold">
          🐝 수정벌 추천 리스트
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="ml-2 text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="custom-box2 shadow-lg">
        <div className="custom-box2-title w-full text-xl font-semibold">
          🐝 수정벌 추천 리스트
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500 text-center">
            <p className="font-semibold">오류 발생</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => loadList()}
              className="mt-2 px-4 py-1 bg-pink-500 text-white rounded text-sm"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!list || list.length === 0) {
    return (
      <div className="custom-box2 shadow-lg">
        <div className="custom-box2-title w-full text-xl font-semibold">
          🐝 수정벌 추천 리스트
        </div>
        <div className="flex flex-col justify-center items-center py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📂</div>
          </div>

          <p className="text-gray-500  mb-4">추천된 수정벌이 없습니다.</p>
          <div className="text-gray-400 text-xs  mb-4">
            수정벌 추천을 통해 내게 맞는 수정벌을 확인해보세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box2 shadow-lg isolate transform-gpu">
      <header className="custom-box2-title w-full text-base font-medium">
        <span className="custom-box2-icon">🐝</span>수정벌 추천 리스트
      </header>
      <div className="px-2 py-2 isolate overflow-hidden">
        <ul className="flex flex-row overflow-x-auto p-4 gap-4 min-h-[200px] isolate transform-gpu">
          {list.map((item: BeeRecommendation) => (
            <li
              key={item.beeRecommendationId}
              className="min-w-[280px] h-[180px] bg-white rounded-2xl p-4 drop-shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between items-start hover:scale-105 transform cursor-pointer isolate transform-gpu will-change-transform"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.beeRecommendationId);
                setOpenModal(true);
              }}
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

              {/* 투입 기간 정보 */}
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-medium">추천 투입 기간:</span>
                <span className="ml-1">
                  {formatDate(item.inputStartDate)} ~{" "}
                  {formatDate(item.inputEndDate)}
                </span>
              </div>
              <div>저장일자: {item.createdAt}</div>
              {/* 재배지 정보 */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                  {getCultivationTypeKorean(item.cultivationType)}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                  {item.cultivationAddress}
                </span>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
