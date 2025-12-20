"use client";

import React, { useEffect } from "react";
import { useBeeRecommendationStore } from "../model/store";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { BeeRecommendation } from "../model/types";
import { getCultivationTypeKorean } from "@/shared/utils/cultivationUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

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


// 실제 카드 컴포넌트
const RecommendationCard: React.FC<{
  item: BeeRecommendation;
  onSelect: (id: number) => void;
  setOpenModal: (value: boolean) => void;
}> = ({ item, onSelect, setOpenModal }) => (
  <div
    className="w-full bg-white rounded-2xl p-4 border border-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-colors duration-300 flex flex-col justify-between items-start cursor-pointer mb-2"
    onClick={(e) => {
      e.stopPropagation();
      onSelect(item.beeRecommendationId);
      setOpenModal(true);
    }}
  >
    {/* 헤더 영역 - 고정 높이 */}
    <div className="flex items-center justify-between w-full mb-2 min-h-[24px] border-b border-gray-400 pb-2">
      <span className="text-lg font-semibold text-main-900 truncate">
        {getBeeTypeKorean(item.beeType)}
      </span>
      <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
        추천
      </span>
    </div>

    {/* 컨텐츠 영역 - 고정 높이와 overflow 처리 */}
    <div className="flex-1 w-full min-h-[80px] flex flex-col justify-between">
      <div className="space-y-1 text-base font-medium">
        <div className=" text-gray-700 truncate ">
          <span className="w-[110px] inline-block">작물명</span>
          <span className="text-gray-900 font-regular">{item.cropName}</span>
        </div>
        
        <div className=" text-gray-700 truncate">
          <span className="w-[110px] inline-block">저장일자</span>
          <span className="text-gray-900 font-regular">{item.createdAt}</span>
        </div>

        {/* 투입 기간 정보 */}
        <div className=" text-gray-700 truncate">
          <span className="w-[110px] inline-block">추천 투입 기간</span>
          <span className="text-gray-900 font-regular">
            {formatDate(item.inputStartDate)} ~ {formatDate(item.inputEndDate)}
          </span>
        </div>

      </div>
      {/* 태그 영역  */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs truncate max-w-[80px]">
          {getCultivationTypeKorean(item.cultivationType)}
        </span>
        <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs truncate max-w-[100px]">
          {item.cultivationAddress}
        </span>
      </div>
    </div>
  </div>
);

// 빈 상태 컴포넌트
const EmptyState: React.FC = () => (
  <div className="flex flex-col justify-center items-center">
    <div className="text-center">
      <div className="text-4xl mb-4">📂</div>
      <p className="text-gray-500 mb-4">추천된 수정벌이 없습니다.</p>
      <div className="text-gray-400 text-xs mb-4">
        수정벌 추천을 통해 내게 맞는 수정벌을 확인해보세요.
      </div>
    </div>
  </div>
);

// 에러 상태 컴포넌트
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex justify-center items-center">
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
    <div className="w-full">
      <header className="text-base font-medium pb-3">
        <span className="text-lg font-semibold text-gray-900">수정벌 추천 리스트</span>
      </header>
      <div className="">
        {/* 로딩 상태 */}
        {loading && list === null && (
          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            freeMode={true}
            className="w-full"
          >
            {[1, 2, 3].map((index) => (
              <SwiperSlide key={`skeleton-${index}`} className="!w-[335px]">
              </SwiperSlide>
            ))}
          </Swiper>
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
          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            freeMode={true}
            className="w-full p-4"
          >
            {list.map((item: BeeRecommendation) => (
              <SwiperSlide key={item.beeRecommendationId} className="!w-[315px]">
                <RecommendationCard
                  item={item}
                  onSelect={onSelect}
                  setOpenModal={setOpenModal}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};