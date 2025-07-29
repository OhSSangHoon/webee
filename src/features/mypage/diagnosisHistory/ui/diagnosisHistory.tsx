"use client";

import api from "@/shared/auth/lib";
import {
  getBeeDiseaseKorean,
  getBeeTypeKorean,
} from "@/shared/types/beeSwitch";
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

  const listApi = async () => {
    try {
      const response = await api.get("/bee/diagnosis");
      if (response.data?.data) {
        setDiagnosisList(response.data.data);
      }
    } catch (error) {
      console.error("질병진단결과 목록조회 오류", error);
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

  return (
    <div className="custom-box2">
      <div className="custom-box2-title">질병 진단 결과 히스토리</div>
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
            <div className="flex justify-center mb-6">
              <img
                src={detailContent.imageUrl}
                alt={detailContent.diseaseType}
                className="rounded-lg max-h-64 object-contain"
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

      <div className="flex flex-col max-h-150 overflow-scroll">
        {diagnosisList.map((item) => (
          <div
            key={item.beeDiagnosisId}
            className="flex flex-row justify-start items-start gap-10 hover:bg-blue-50 px-10 py-5 "
            onClick={() => openDetailModal(item.beeDiagnosisId)}
          >
            <div className="w-22 h-22 min-w-[88px] min-h-[88px] bg-gray-200 rounded-md overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.diseaseType}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold">
                {getBeeDiseaseKorean(item.diseaseType)} ({item.createdAt})
              </div>
              <div className="text-xs text-[#4B5563] whitespace-pre-line">
                {item.situationAnalysis}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
