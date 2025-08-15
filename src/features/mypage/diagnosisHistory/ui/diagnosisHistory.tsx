"use client";

import api from "@/shared/auth/lib";
import Image from "next/image";
import { getBeeDiseaseKorean } from "@/shared/types/beeSwitch";
import { useEffect, useState } from "react";

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

// 스켈레톤 아이템 컴포넌트 - 실제 진단 결과와 동일한 크기 보장
const SkeletonDiagnosisItem: React.FC = () => (
  <div className="flex flex-row justify-start items-start gap-10 rounded-b-xl px-10 py-5 min-h-[100px] transform-gpu">
    {/* 이미지 스켈레톤 */}
    <div className="w-22 h-22 min-w-[88px] min-h-[88px] bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
    
    {/* 텍스트 스켈레톤 */}
    <div className="flex flex-col gap-3 flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
    </div>
  </div>
);

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

// 진단 결과 아이템 컴포넌트
const DiagnosisItem: React.FC<{
  item: DiagnosisItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="flex flex-row justify-start items-start gap-10 rounded-b-xl hover:bg-blue-50 px-10 py-5 hover:shadow-md transition-all duration-300 group min-h-[100px] transform-gpu will-change-transform cursor-pointer"
      onClick={onClick}
    >
      {/* 이미지 컨테이너 - 고정 크기 */}
      <div className="relative w-22 h-22 min-w-[88px] min-h-[88px] aspect-square overflow-hidden flex-shrink-0 isolate">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gray-100 rounded-md"></div>
        
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
            className={`object-cover rounded-md hover:scale-105 transform-gpu transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="88px"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* 텍스트 컨텐츠 - flex-1으로 남은 공간 활용 */}
      <div className="flex flex-col gap-3 flex-1 min-w-0 isolate">
        {/* 제목 - 고정 높이 */}
        <div className="text-sm font-semibold text-ellipsis-1-line h-5 flex items-center">
          {getBeeDiseaseKorean(item.diseaseType)} ({item.createdAt})
        </div>
        
        {/* 설명 - 고정 높이와 라인 제한 */}
        <div 
          className="text-xs text-[#4B5563] overflow-hidden"
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
    <div className="custom-box2 isolate">
      {/* 헤더 - 고정 높이 */}
      <div className="custom-box2-title flex-shrink-0">
        <span className="custom-box2-icon">💉</span>질병 진단 결과
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
            <div className="relative w-full h-64 mb-6">
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

      {/* 컨텐츠 영역 - 최소 높이 보장 */}
      <div className="flex flex-col-reverse list-container">
        {/* 로딩 상태 */}
        {isLoading && (
          <>
            {[1, 2, 3].map((index) => (
              <SkeletonDiagnosisItem key={`skeleton-${index}`} />
            ))}
          </>
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
          <>
            {diagnosisList.map((item) => (
              <DiagnosisItem
                key={item.beeDiagnosisId}
                item={item}
                onClick={() => openDetailModal(item.beeDiagnosisId)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}