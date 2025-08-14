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

  // 로딩 상태 - 스켈레톤 UI로 layout shift 방지 (list가 null이고 로딩 중일 때)
  if (loading && list === null) {
    return (
      <div className="custom-box2 shadow-lg isolate transform-gpu">
        <header className="custom-box2-title w-full text-base font-medium">
          <span className="custom-box2-icon">🐝</span>수정벌 추천 리스트
        </header>
        <div className="px-2 py-2 isolate overflow-hidden">
          <ul className="flex flex-row overflow-x-auto p-4 gap-4 isolate transform-gpu">
            {[1, 2, 3].map((index) => (
              <li
                key={index}
                className="min-w-[280px] h-[180px] bg-white rounded-2xl p-4 drop-shadow-md border border-transparent flex flex-col justify-between items-start isolate"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="custom-box2 shadow-lg isolate transform-gpu">
        <header className="custom-box2-title w-full text-base font-medium">
          <span className="custom-box2-icon">🐝</span>수정벌 추천 리스트
        </header>
        <div className="px-2 py-2 isolate overflow-hidden min-h-[200px] flex justify-center items-center">
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
      <div className="custom-box2 shadow-lg isolate transform-gpu">
        <header className="custom-box2-title w-full text-base font-medium">
          <span className="custom-box2-icon">🐝</span>수정벌 추천 리스트
        </header>
        <div className="px-2 py-2 isolate overflow-hidden min-h-[200px] flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📂</div>
          </div>
          <p className="text-gray-500 mb-4">추천된 수정벌이 없습니다.</p>
          <div className="text-gray-400 text-xs mb-4">
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
      <div className="px-2 py-2 isolate overflow-hidden min-h-[200px]">
        <ul className="flex flex-row overflow-x-auto p-4 gap-4 isolate transform-gpu">
          {list.map((item: BeeRecommendation) => (
            <li
              key={item.beeRecommendationId}
              className="min-w-[280px] h-[180px] bg-white rounded-2xl p-4 drop-shadow-md border border-transparent hover:border-pink-300 hover:bg-pink-50/30 transition-colors duration-300 flex flex-col justify-between items-start cursor-pointer isolate"
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
