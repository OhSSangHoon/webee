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

// 스켈레톤 카드 컴포넌트 - 실제 카드와 동일한 크기 보장
const SkeletonCard: React.FC = () => (
  <li className="min-w-[280px] h-[180px] bg-white rounded-2xl p-4 drop-shadow-md border border-transparent flex flex-col justify-between items-start isolate animate-pulse">
    {/* 헤더 영역 */}
    <div className="flex items-center justify-between w-full mb-2">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="h-5 bg-gray-200 rounded-full w-12"></div>
    </div>

    {/* 작물명 */}
    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
    
    {/* 투입 기간 */}
    <div className="h-4 bg-gray-200 rounded w-40 mb-1"></div>
    
    {/* 저장일자 */}
    <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>

    {/* 태그들 */}
    <div className="flex gap-2 mt-auto">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
  </li>
);

// 실제 카드 컴포넌트 - 고정 높이 보장
const RecommendationCard: React.FC<{
  item: BeeRecommendation;
  onSelect: (id: number) => void;
  setOpenModal: (value: boolean) => void;
}> = ({ item, onSelect, setOpenModal }) => (
  <li
    className="min-w-[280px] h-[180px] bg-white rounded-2xl p-4 drop-shadow-md border border-transparent hover:border-blue-300 hover:bg-blue-50/30 transition-colors duration-300 flex flex-col justify-between items-start cursor-pointer isolate transform-gpu will-change-transform"
    onClick={(e) => {
      e.stopPropagation();
      onSelect(item.beeRecommendationId);
      setOpenModal(true);
    }}
  >
    {/* 헤더 영역 - 고정 높이 */}
    <div className="flex items-center justify-between w-full mb-2 min-h-[24px]">
      <span className="text-lg font-bold text-gray-800 truncate">
        {getBeeTypeKorean(item.beeType)}
      </span>
      <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
        추천
      </span>
    </div>

    {/* 컨텐츠 영역 - 고정 높이와 overflow 처리 */}
    <div className="flex-1 w-full min-h-[80px] flex flex-col justify-between">
      <div className="space-y-1">
        <div className="text-sm text-gray-700 truncate">
          <span className="font-medium">작물명:</span> {item.cropName}
        </div>

        {/* 투입 기간 정보 */}
        <div className="text-sm text-gray-700 truncate">
          <span className="font-medium">추천 투입 기간:</span>
          <span className="ml-1">
            {formatDate(item.inputStartDate)} ~ {formatDate(item.inputEndDate)}
          </span>
        </div>
        
        <div className="text-xs text-gray-500 truncate">
          저장일자: {item.createdAt}
        </div>
      </div>

      {/* 태그 영역 - 고정 위치 */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs truncate max-w-[80px]">
          {getCultivationTypeKorean(item.cultivationType)}
        </span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs truncate max-w-[100px]">
          {item.cultivationAddress}
        </span>
      </div>
    </div>
  </li>
);

// 빈 상태 컴포넌트 - 고정 높이 보장
const EmptyState: React.FC = () => (
  <div className="min-h-[200px] flex flex-col justify-center items-center px-4">
    <div className="text-center">
      <div className="text-4xl mb-4">📂</div>
      <p className="text-gray-500 mb-4">추천된 수정벌이 없습니다.</p>
      <div className="text-gray-400 text-xs mb-4">
        수정벌 추천을 통해 내게 맞는 수정벌을 확인해보세요.
      </div>
    </div>
  </div>
);

// 에러 상태 컴포넌트 - 고정 높이 보장
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-[200px] flex justify-center items-center px-4">
    <div className="text-red-500 text-center">
      <p className="font-semibold">오류 발생</p>
      <p className="text-sm mt-1">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-1 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-colors"
      >
        다시 시도
      </button>
    </div>
  </div>
);

export const BeeRecommendationList: React.FC<BeeRecommendationListProps> = ({
  onSelect,
  setOpenModal,
}) => {
  const { list, loading, error, loadList } = useBeeRecommendationStore();

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <div className="custom-box2 shadow-lg isolate transform-gpu">
      <header className="custom-box2-title w-full text-base font-medium">
        <span className="custom-box2-icon">🐝</span>수정벌 추천 리스트
      </header>
      
      {/* 컨테이너 - 항상 최소 높이 보장으로 layout shift 방지 */}
      <div className="px-2 py-2 isolate overflow-hidden min-h-[220px]">
        {/* 로딩 상태 */}
        {loading && list === null && (
          <ul className="flex flex-row overflow-x-auto p-4 gap-4 isolate transform-gpu">
            {[1, 2, 3].map((index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </ul>
        )}

        {/* 에러 상태 */}
        {error && (
          <ErrorState error={error} onRetry={loadList} />
        )}

        {/* 빈 상태 */}
        {!loading && !error && (!list || list.length === 0) && (
          <EmptyState />
        )}

        {/* 데이터 있는 상태 */}
        {!loading && !error && list && list.length > 0 && (
          <ul className="flex flex-row overflow-x-auto p-4 gap-4 isolate transform-gpu">
            {list.map((item: BeeRecommendation) => (
              <RecommendationCard
                key={item.beeRecommendationId}
                item={item}
                onSelect={onSelect}
                setOpenModal={setOpenModal}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};