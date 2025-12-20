"use client";

import api from "@/shared/auth/lib";
import Image from "next/image";
import { getBeeDiseaseKorean } from "@/shared/types/beeSwitch";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

interface DiagnosisItem {
  beeDiagnosisId: number;
  imageUrl: string;
  diseaseType: string;
  situationAnalysis: string;
  createdAt: string;
}

interface DiagnosisDetail {
  beeDiagnosisId: number;
  imageUrl: string;
  diseaseType: string;
  confidence: number;
  cropName: string;
  cultivationType: string;
  cultivationAddress: string;
  details: string;
  situationAnalysis: string;
  solutions: string;
  createdAt: string;
}

// 빈 상태 컴포넌트
const EmptyDiagnosisState: React.FC = () => (
  <div className="flex items-center justify-center min-h-[250px]">
    <div className="text-center">
      <div className="text-4xl mb-4">🔬</div>
      <div className="text-gray-500 text-sm mb-4">아직 진단 결과가 없습니다.</div>
      <div className="text-gray-400 text-xs">질병 진단을 통해 결과를 확인해보세요.</div>
    </div>
  </div>
);

// 에러 상태 컴포넌트
const ErrorDiagnosisState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-[250px]">
    <div className="text-center">
      <div className="text-red-500 mb-3">{error}</div>
      <button
        onClick={onRetry}
        className="text-blue-500 hover:underline text-sm bg-blue-50 px-3 py-1 rounded transition-colors"
      >
        다시 시도
      </button>
    </div>
  </div>
);

// 진단 결과 카드 컴포넌트
const DiagnosisCard: React.FC<{
  item: DiagnosisItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="w-full bg-white rounded-2xl p-4 border border-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-colors duration-300 flex flex-col gap-3 cursor-pointer mb-2 transform-gpu will-change-transform"
      onClick={onClick}
    >
      {/* 상단: 이미지 + 제목/날짜 */}
      <div className="flex items-start gap-3">
        {/* 이미지 컨테이너 - 40px x 40px */}
        <div className="relative w-10 h-10 overflow-hidden flex-shrink-0 isolate">
          {/* 배경 */}
          <div className="absolute inset-0 bg-gray-100 rounded-xl"></div>

          {/* 로딩 상태 */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* 실제 이미지 */}
          {!imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.diseaseType}
              fill
              className={`object-cover rounded-xl transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="40px"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* 제목 + 날짜 */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* 제목 */}
          <div className="text-sm font-bold text-gray-800 truncate">
            {getBeeDiseaseKorean(item.diseaseType)}
          </div>

          {/* 날짜 */}
          <div className="text-xs text-gray-500 truncate">
            {item.createdAt}
          </div>
        </div>
      </div>

      {/* 하단: 진단 설명 */}
      <div
        className="text-xs text-gray-600 overflow-hidden"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4',
          maxHeight: '4.2em'
        }}
      >
        {item.situationAnalysis}
      </div>
    </div>
  );
};

export default function DiagnosisHistory() {
  const [diagnosisList, setDiagnosisList] = useState<DiagnosisItem[]>([]);
  const [detailModal, setDetailModal] = useState(false);
  const [detailContent, setDetailContent] = useState<DiagnosisDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listApi = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/bee/diagnosis");
      if (response.data?.data) {
        setDiagnosisList(response.data.data);
      } else {
        setDiagnosisList([]);
      }
    } catch (error) {
      console.error("질병진단결과 목록조회 오류", error);
      setError("질병 진단 결과를 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const detailApi = async (beeDiagnosisId: number) => {
    try {
      const response = await api.get(`/bee/diagnosis/${beeDiagnosisId}`);
      setDetailContent(response.data.data);
    } catch (error) {
      console.error(error);
      setDetailModal(false);
    }
  };

  const openDetailModal = (id: number) => {
    detailApi(id);
    setDetailModal(true);
  };

  useEffect(() => {
    listApi();
  }, []);

  return (
    <div className="w-full py-4">
      {/* 헤더 - 고정 높이 */}
      <div className="pb-3">
        <span className="text-lg font-semibold text-gray-900">질병 진단 결과</span>
      </div>

      {/* 모달 */}
      {detailModal && detailContent && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setDetailModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                질병 진단 세부사항
              </h2>
              <button
                onClick={() => setDetailModal(false)}
                className="text-gray-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* 진단 이미지 - 고정 크기 */}
            <div className="relative w-full">
              <Image
                src={detailContent.imageUrl}
                alt={detailContent.diseaseType}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            {/* 상세 정보 */}
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>질병명:</strong>{" "}
                {getBeeDiseaseKorean(detailContent.diseaseType)}
              </div>
              <div>
                <strong>신뢰도:</strong> {detailContent.confidence}%
              </div>
              <div>
                <strong>작물명:</strong> {detailContent.cropName}
              </div>
              <div>
                <strong>재배 방식:</strong>{" "}
                {detailContent.cultivationType === "CONTROLLED" ? "노지" : "하우스"}
              </div>
              <div>
                <strong>재배지 주소:</strong> {detailContent.cultivationAddress}
              </div>
              <div>
                <strong>세부 사항:</strong> {detailContent.details}
              </div>
              <div className="whitespace-pre-line">
                <strong>상황 분석:</strong> {detailContent.situationAnalysis}
              </div>
              <div className="whitespace-pre-line">
                <strong>해결 방안:</strong> {detailContent.solutions}
              </div>
              <div>
                <strong>진단 일자:</strong> {detailContent.createdAt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 컨텐츠 영역 */}
      <div className="isolate overflow-hidden">
        {/* 로딩 상태 */}
        {isLoading && (
          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            freeMode={true}
            className="w-full"
          >
            {[1, 2, 3].map((index) => (
              <SwiperSlide key={`skeleton-${index}`} className="!w-[315px]">
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <ErrorDiagnosisState error={error} onRetry={listApi} />
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && diagnosisList.length === 0 && (
          <EmptyDiagnosisState />
        )}

        {/* 실제 진단 결과 목록 */}
        {!isLoading && !error && diagnosisList.length > 0 && (
          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            freeMode={true}
            className="w-full"
          >
            {diagnosisList.map((item) => (
              <SwiperSlide key={item.beeDiagnosisId} className="!w-[315px]">
                <DiagnosisCard
                  item={item}
                  onClick={() => openDetailModal(item.beeDiagnosisId)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}