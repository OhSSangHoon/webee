"use client";


import { useState, useEffect } from 'react';
import { getBeeDiagnosisList } from '../api/api';
import { BeeDiagnosisItem } from '../model/model';
import Image from 'next/image';


export default function DiagnosisHistory() {
  const [diagnosisList, setDiagnosisList] = useState<BeeDiagnosisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosisList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBeeDiagnosisList();
        setDiagnosisList(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '진단 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisList();
  }, []);

  if (loading) {
    return (
      <div className="custom-box2">
        <div className="custom-box2-title">질병 진단 결과 히스토리</div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-box2">
        <div className="custom-box2-title">질병 진단 결과 히스토리</div>
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box2">
      <div className="custom-box2-title">질병 진단 결과 히스토리</div>
      <div className="flex flex-col">
        {diagnosisList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>아직 진단 결과가 없습니다.</p>
          </div>
        ) : (
          diagnosisList.map((item) => (
            <div 
              key={item.beeDiagnosisId}
              className="flex flex-row justify-start items-start gap-10 hover:bg-blue-50 px-10 py-5"
            >
              <div className="w-22 h-22 bg-gray-200 rounded-md overflow-hidden">
                <Image 
                  src={item.imageUrl} 
                  alt={item.diseaseType}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패시 기본 배경 표시
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold">{item.diseaseType}</div>
                <div className="text-xs text-[#4B5563]">
                  {item.situationAnalysis}
                </div>
                <div className="text-xs text-gray-400">
                  진단일: {item.createdAt}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}