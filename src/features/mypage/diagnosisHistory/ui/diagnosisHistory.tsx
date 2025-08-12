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
      console.log("세부사항", detailContent);
    } catch (error) {
      console.log("질병진단결과 세부내용 조회 오류", error);
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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="custom-box2">
        <div className="custom-box2-title">
          <span className="custom-box2-icon">💉</span>질병 진단 결과
        </div>
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-gray-500 text-sm">진단 결과를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="custom-box2">
        <div className="custom-box2-title">
          <span className="custom-box2-icon">💉</span>질병 진단 결과
        </div>
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="text-center">
            <div className="text-red-500 mb-3">{error}</div>
            <button
              onClick={listApi}
              className="text-blue-500 hover:underline text-sm bg-blue-50 px-3 py-1 rounded transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 없음 상태
  if (diagnosisList.length === 0) {
    return (
      <div className="custom-box2">
        <div className="custom-box2-title">
          <span className="custom-box2-icon">💉</span>질병 진단 결과
        </div>
        <div className="flex items-center justify-center min-h-[250px]">
          <div className="text-center">
            <div className="text-4xl mb-4">🔬</div>
            <div className="text-gray-500 text-sm mb-4">아직 진단 결과가 없습니다.</div>
            <div className="text-gray-400 text-xs">질병 진단을 통해 결과를 확인해보세요.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box2 isolate">
      <div className="custom-box2-title">
        <span className="custom-box2-icon">💉</span>질병 진단 결과
      </div>
      {detailModal && detailContent && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50  "
          onClick={() => {
            setDetailModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in "
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

            {/* 진단 이미지 */}
            <div className="relative w-full h-64">
              <Image
                src={detailContent.imageUrl}
                alt={detailContent.diseaseType}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>질병명:</strong>
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
                {detailContent.cultivationType === "CONTROLLED"
                  ? "노지"
                  : "하우스"}
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

      {/* 진단 결과 목록 - layout shift 방지 */}
      <div className="flex flex-col-reverse max-h-150 min-h-[250px] isolate transform-gpu">
        {diagnosisList.map((item) => (
          <div
            key={item.beeDiagnosisId}
            className="flex flex-row justify-start items-start gap-10 rounded-b-xl hover:bg-blue-50 px-10 py-5 hover:shadow-md transition-all duration-300 group min-h-[100px] transform-gpu will-change-transform"
            onClick={() => openDetailModal(item.beeDiagnosisId)}
          >
            <div className="relative w-22 h-22 min-w-[88px] min-h-[88px] aspect-square overflow-hidden isolate">
              <Image
                src={item.imageUrl}
                alt={item.diseaseType}
                fill
                className="object-cover rounded-md hover:scale-105 transform-gpu"
                sizes="88px"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-0 isolate">
              <div className="text-sm font-semibold truncate">
                {getBeeDiseaseKorean(item.diseaseType)} ({item.createdAt})
              </div>
              <div className="text-xs text-[#4B5563] whitespace-pre-line overflow-hidden">
                {item.situationAnalysis}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
