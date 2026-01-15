"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import type { ReportResult as ReportResultType } from "@/shared/types/report";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Bug, 
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
  Clock,
  MapPin,
  RefreshCw,
  Layers,
  AlertCircle,
  Info,
} from "lucide-react";

interface ReportResultProps {
  result: ReportResultType;
  onNewReport: () => void;
}

interface BeeRecommendation {
  rank: number;
  name: string;
  price: number;
  lifespan: string;
  cropMatch: number;
  tempRange: string;
  features: string[];
  recommended: boolean;
}

function formatCurrency(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
  if (value >= 10000) return `${Math.round(value / 10000)}만`;
  return `${value.toLocaleString()}`;
}

export function ReportResult({ result, onNewReport }: ReportResultProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { revenueAnalysis, input, brandComparison, managementActions } = result;

  // 페이지 변경 시 스크롤을 맨 위로 즉시 이동
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [currentPage]);
  
  const boxesPerHouse = input.boxesPerHouse || 3;
  const greenhouseSize = input.greenhouseSize || 330;
  const densityPer100 = (boxesPerHouse / greenhouseSize) * 100;
  const isDensityLow = densityPer100 < 1;
  
  const cropName = input.crop === "strawberry" ? "딸기" : input.crop;
  const varietyName = input.cropVariety === "seolhyang" ? "설향" : input.cropVariety || "";
  const brandName = input.beeBrand === "jirisan" ? "지리산" : input.beeBrand === "maya" ? "마야" : "코리아넷";
  
  const hasEnvData = input.hasSmartFarm && input.averageTemperature && input.averageHumidity;
  const tempOptimal = input.averageTemperature && input.averageTemperature >= 18 && input.averageTemperature <= 25;
  const humidOptimal = input.averageHumidity && input.averageHumidity >= 60 && input.averageHumidity <= 75;
  const tempHigh = input.averageTemperature && input.averageTemperature > 25;
  const humidHigh = input.averageHumidity && input.averageHumidity > 75;

  const overallScore = 
    (tempOptimal ? 25 : tempHigh ? 10 : 20) +
    (humidOptimal ? 25 : humidHigh ? 10 : 20) +
    (isDensityLow ? 15 : 25) + 15;

  const totalPages = 3;

  // API 응답 기반 수정벌 추천
  const beeRecommendations: BeeRecommendation[] = brandComparison ? [
    {
      rank: 1,
      name: brandComparison.brand1.name,
      price: brandComparison.brand1.price || 45000,
      lifespan: `${brandComparison.brand1.replacementCycleWeeks || 3}주`,
      cropMatch: brandComparison.brand1.activityRate || 95,
      tempRange: brandComparison.brand1.optimalTemperature
        ? `${brandComparison.brand1.optimalTemperature.min}~${brandComparison.brand1.optimalTemperature.max}°C`
        : "15~25°C",
      features: brandComparison.brand1.features,
      recommended: brandName === brandComparison.brand1.name.replace(" 수정벌", ""),
    },
    {
      rank: 2,
      name: brandComparison.brand2.name,
      price: brandComparison.brand2.price || 42000,
      lifespan: `${brandComparison.brand2.replacementCycleWeeks || 3}주`,
      cropMatch: brandComparison.brand2.activityRate || 88,
      tempRange: brandComparison.brand2.optimalTemperature
        ? `${brandComparison.brand2.optimalTemperature.min}~${brandComparison.brand2.optimalTemperature.max}°C`
        : "18~30°C",
      features: brandComparison.brand2.features,
      recommended: false,
    },
  ] : [];

  // 우선 개선 사항 (managementActions 기반)
  const priorityImprovements = managementActions.slice(0, 3).map((action, index) => ({
    priority: index + 1,
    issue: action.title,
    urgent: true,
    reason: action.target,
  }));

  // API 응답 기반 시장 가격 계산
  const marketPrice = revenueAnalysis.currentRevenue / revenueAnalysis.currentYield;
  const priceUpdateTime = new Date().toLocaleString("ko-KR", { 
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" 
  });

  return (
    <div ref={containerRef} className="flex flex-col w-full select-none">
      {/* Page Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3].map((page) => (
          <div key={page} className={`h-1.5 rounded-full transition-all ${currentPage === page ? "w-8 bg-[#22C55E]" : "w-2 bg-white/20"}`} />
        ))}
      </div>

      {/* Page 1: 수정벌 추천 및 환경 진단 */}
      {currentPage === 1 && (
        <div className="space-y-4">
          {/* 점수 히어로 섹션 */}
          <div className="bg-gradient-to-br from-[#1A1F3D] to-[#0A0E27] rounded-2xl p-6 text-white text-center border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] mb-2">{cropName}({varietyName}) 분석 리포트</p>
            <h2 className="text-sm font-semibold text-white/80 mb-4">수정벌 관리 최적화 지수</h2>
            
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="url(#scoreGradient)" strokeWidth="10"
                  strokeDasharray={264} strokeDashoffset={264 * (1 - overallScore / 100)}
                  strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallScore}</span>
                <span className="text-xs text-white/60">점</span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-white/80">상위 <span className="text-[#22C55E] font-bold">{Math.max(1, 100 - Math.round(overallScore * 0.8))}%</span>입니다</p>
          </div>

          {/* 수정벌 추천 */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0A0E27] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <Bug className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
              1. 맞춤 수정벌 추천
            </h3>
            
            {/* 최고 추천 */}
            <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 rounded-xl p-4 border-2 border-[#22C55E]/40 relative">
              <div className="absolute -top-2 left-4 bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEST</div>
              <div className="flex items-center justify-between mb-3 pt-1">
                <span className="text-base font-bold text-[#22C55E]">{beeRecommendations[0].name}</span>
                <span className="text-base font-bold text-[#0A0E27]">{beeRecommendations[0].price.toLocaleString()}원<span className="text-xs font-normal text-gray-500">/박스</span></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">교체 주기</p>
                  <p className="font-bold text-[#0A0E27]">{beeRecommendations[0].lifespan}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">{cropName} 적합도</p>
                  <p className="font-bold text-[#22C55E]">{beeRecommendations[0].cropMatch}%</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">적정 온도</p>
                  <p className="font-bold text-[#0A0E27]">{beeRecommendations[0].tempRange}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {beeRecommendations[0].features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full font-medium">{f}</span>
                ))}
              </div>
            </div>
            
            {/* 다른 추천 */}
            {beeRecommendations.length > 1 && (
              <div className="grid grid-cols-1 gap-3">
                {beeRecommendations.slice(1).map((bee) => (
                  <div key={bee.rank} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700">{bee.name}</span>
                      {bee.recommended && <span className="text-[9px] bg-[#3B82F6] text-white px-1.5 py-0.5 rounded">사용중</span>}
                    </div>
                    <div className="space-y-1 text-[10px] text-gray-600 mb-2">
                      <div className="flex justify-between">
                        <span>가격</span>
                        <span className="font-semibold text-gray-800">{bee.price.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>교체</span>
                        <span className="font-semibold text-gray-800">{bee.lifespan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>적합도</span>
                        <span className="font-semibold text-gray-800">{bee.cropMatch}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bee.features.map((f, i) => (
                        <span key={i} className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 환경 진단 */}
          {hasEnvData && (
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#0A0E27] flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                </div>
                2. 온·습도 상태 진단
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Thermometer className="w-5 h-5 mx-auto mb-2 text-[#FFD55F]" />
                  <p className="text-[10px] text-gray-500 mb-1">평균 온도</p>
                  <p className={`text-xl font-bold ${tempOptimal ? "text-[#22C55E]" : "text-[#FFD55F]"}`}>{input.averageTemperature}°C</p>
                  <p className="text-[10px] text-gray-400 mt-1">벌 최적: 18~25°C</p>
                  <p className="text-[10px] text-gray-400">{cropName} 최적: 15~25°C</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Droplets className="w-5 h-5 mx-auto mb-2 text-[#3B82F6]" />
                  <p className="text-[10px] text-gray-500 mb-1">평균 습도</p>
                  <p className={`text-xl font-bold ${humidOptimal ? "text-[#22C55E]" : "text-red-500"}`}>{input.averageHumidity}%</p>
                  <p className="text-[10px] text-gray-400 mt-1">벌 최적: 50~70%</p>
                  <p className="text-[10px] text-gray-400">{cropName} 최적: 60~75%</p>
                </div>
              </div>
              
              {(tempHigh || humidHigh) && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> 문제 진단
                  </p>
                  <ul className="text-xs text-red-600/80 mt-1 space-y-0.5">
                    {tempHigh && <li>• 고온으로 벌 비행 시간 단축</li>}
                    {humidHigh && <li>• 고습으로 꽃가루 점착, 수정 효율 하락</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Page 2: 개선 방안 */}
      {currentPage === 2 && (
        <div className="space-y-4">
          {/* 우선 개선 사항 */}
          {priorityImprovements.length > 0 && (
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-5 border border-red-500/20">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
                우선 개선 사항 (시급 순)
              </h3>
              
              <div className="space-y-2">
                {priorityImprovements.map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl p-3 flex items-start gap-3 border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.issue}</p>
                      <p className="text-xs text-white/70">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 온도 관리 */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0A0E27] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FFD55F]/20 flex items-center justify-center">
                <Thermometer className="w-3.5 h-3.5 text-[#FFD55F]" />
              </div>
              3. 온도 관리
            </h3>
            
            <div className="bg-[#FFD55F]/5 rounded-xl p-4 border border-[#FFD55F]/20 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="font-semibold text-[#0A0E27] mb-1">벌 최적 온도</p>
                  <p className="text-lg font-bold text-[#FFD55F]">18~25°C</p>
                  <p className="text-[10px] text-gray-500 mt-1">저온시 활동 저하, 고온시 비행 단축</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="font-semibold text-[#0A0E27] mb-1">{cropName} 최적 온도</p>
                  <p className="text-lg font-bold text-[#22C55E]">15~25°C</p>
                  <p className="text-[10px] text-gray-500 mt-1">개화 및 착과에 적합한 온도</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />오전 9~11시 개화 시간대 환기 강화</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />고온 시(25°C 초과) 차광막 활용</li>
              </ul>
            </div>
          </div>

          {/* 습도 관리 */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0A0E27] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
              </div>
              4. 습도 관리
            </h3>
            
            <div className="bg-[#3B82F6]/5 rounded-xl p-4 border border-[#3B82F6]/20 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="font-semibold text-[#0A0E27] mb-1">벌 최적 습도</p>
                  <p className="text-lg font-bold text-[#3B82F6]">50~70%</p>
                  <p className="text-[10px] text-gray-500 mt-1">고습시 날개 젖음, 비행 저하</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="font-semibold text-[#0A0E27] mb-1">{cropName} 최적 습도</p>
                  <p className="text-lg font-bold text-[#22C55E]">60~75%</p>
                  <p className="text-[10px] text-gray-500 mt-1">꽃가루 방출에 적합한 습도</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />오전 관수 집중으로 오후 습도 상승 방지</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />관수 후 1~2시간 내 환기 타이밍 설정</li>
              </ul>
            </div>
          </div>

          {/* 벌 관리 */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0A0E27] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#22C55E]/20 flex items-center justify-center">
                <Bug className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
              5. 벌 관리
            </h3>
            
            <div className="space-y-3">
              {/* 벌통 위치 */}
              <div className="bg-[#22C55E]/5 rounded-xl p-4 border border-[#22C55E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-bold text-[#0A0E27]">벌통 위치</span>
                </div>
                <p className="text-xs text-gray-700 mb-2">하우스 <span className="font-bold text-[#22C55E]">중앙부</span> 배치, 직풍 회피</p>
                <div className="bg-white/80 rounded-lg p-2 text-[10px] text-gray-500 flex items-start gap-1.5">
                  <Info className="w-3 h-3 shrink-0 mt-0.5 text-[#3B82F6]" />
                  <span>중앙 배치 시 비행 거리가 균등해져 수정 효율 20% 향상. 직풍 노출 시 벌 스트레스 증가로 활동성 저하</span>
                </div>
              </div>
              
              {/* 교체 주기 */}
              <div className="bg-[#22C55E]/5 rounded-xl p-4 border border-[#22C55E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-bold text-[#0A0E27]">교체 주기</span>
                </div>
                <p className="text-xs text-gray-700 mb-2">현재 {input.replacementWeeks || 3}주 → <span className="font-bold text-[#22C55E]">{Math.max(2, (input.replacementWeeks || 3) - 0.5)}주</span> 단축 권장</p>
                <div className="bg-white/80 rounded-lg p-2 text-[10px] text-gray-500 flex items-start gap-1.5">
                  <Info className="w-3 h-3 shrink-0 mt-0.5 text-[#3B82F6]" />
                  <span>고온·고습 환경에서 벌 수명 단축. 활동성 저하된 벌 조기 교체로 수정률 유지</span>
                </div>
              </div>
              
              {/* 밀도 보정 */}
              <div className="bg-[#22C55E]/5 rounded-xl p-4 border border-[#22C55E]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-bold text-[#0A0E27]">밀도 보정</span>
                </div>
                <p className="text-xs text-gray-700 mb-2">현재 동당 {boxesPerHouse}박스 → <span className="font-bold text-[#22C55E]">동당 {boxesPerHouse + 1}박스</span> 권장</p>
                <div className="bg-white/80 rounded-lg p-2 text-[10px] text-gray-500 flex items-start gap-1.5">
                  <Info className="w-3 h-3 shrink-0 mt-0.5 text-[#3B82F6]" />
                  <span>100평당 최소 1박스 필요. 현재 {densityPer100.toFixed(1)}박스로 {isDensityLow ? "밀도 부족" : "적정 수준"}. 추가 배치 시 미수정 과일 감소</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page 3: 수익률 분석 */}
      {currentPage === 3 && (
        <div className="space-y-4">
          {/* 수익률 분석 헤더 */}
          <div className="bg-gradient-to-br from-[#1A1F3D] to-[#0A0E27] rounded-2xl p-5 text-white border border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#22C55E]/20 flex items-center justify-center">
                <CircleDollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
              6. 기대 수익률 분석
            </h3>
            
            {/* 가이던스 텍스트 */}
            <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
              <p className="text-xs text-white/80 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-[#3B82F6]" />
                <span>개선 방안을 준수할 경우, 리포트 작성 시간 기준 아래의 추가 수익이 예상됩니다.</span>
              </p>
            </div>
            
            {/* 시장 가격 */}
            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">{cropName} 현재 시세</span>
                <span className="text-[10px] text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {priceUpdateTime} 기준
                </span>
              </div>
              <p className="text-2xl font-bold text-[#FFD55F]">{marketPrice.toLocaleString()}원<span className="text-sm font-normal text-white/60">/kg</span></p>
              <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> 시세 변동에 따라 매출 차이가 발생할 수 있습니다
              </p>
            </div>
            
            {/* 통계 그리드 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] text-white/50 mb-1">연간 생산량</p>
                <p className="text-lg font-bold">{(input.annualKg || 5000).toLocaleString()}<span className="text-xs font-normal">kg</span></p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] text-white/50 mb-1">현재 착과율</p>
                <p className="text-lg font-bold text-white/80">{revenueAnalysis.currentRate}%</p>
              </div>
              <div className="bg-[#22C55E]/20 rounded-lg p-3 text-center border border-[#22C55E]/30">
                <p className="text-[10px] text-[#22C55E] mb-1">개선 후 착과율</p>
                <p className="text-lg font-bold text-[#22C55E]">{revenueAnalysis.improvedRate}%</p>
              </div>
            </div>
            
            {/* 계산 */}
            <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-2 text-xs">
              <p className="text-white/60">
                현재 생산: {(input.annualKg || 5000).toLocaleString()} × {revenueAnalysis.currentRate}% = <span className="font-bold text-white">{Math.round((input.annualKg || 5000) * revenueAnalysis.currentRate / 100).toLocaleString()}kg</span>
              </p>
              <p className="text-white/60">
                개선 후: {(input.annualKg || 5000).toLocaleString()} × {revenueAnalysis.improvedRate}% = <span className="font-bold text-[#22C55E]">{Math.round((input.annualKg || 5000) * revenueAnalysis.improvedRate / 100).toLocaleString()}kg</span>
              </p>
              <p className="text-white/60">
                추가 생산량: <span className="font-bold text-[#22C55E]">+{Math.round(revenueAnalysis.additionalYield).toLocaleString()}kg</span>
              </p>
            </div>
            
            {/* 수익 요약 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/50 mb-1">추가 매출</p>
                <p className="text-xl font-bold text-[#22C55E]">+{formatCurrency(revenueAnalysis.additionalRevenue)}원</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/50 mb-1">추가 비용</p>
                <p className="text-lg font-bold text-white/80">약 200~300만원</p>
              </div>
            </div>
            
            {/* ROI */}
            <div className="bg-[#22C55E]/10 rounded-xl p-4 flex items-center justify-between border border-[#22C55E]/30">
              <div>
                <p className="text-[10px] text-white/50 mb-1">기대 순이익</p>
                <p className="text-xl font-bold">+450~550만원</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 mb-1">기대 ROI</p>
                <p className="text-3xl font-bold text-[#22C55E]">150~200%</p>
              </div>
            </div>
          </div>
          
          {/* 최종 결론 - 큰 폰트 */}
          <div className="bg-gradient-to-br from-[#1A1F3D] to-[#0A0E27] rounded-2xl p-6 border border-[#22C55E]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white mb-2">최종 결론</p>
                <div className="space-y-1.5">
                  <p className="text-sm text-white/90">
                    현재 <span className="font-bold text-white">{brandName} 수정벌</span>은 {cropName}({varietyName})에 적합합니다.
                  </p>
                  <p className="text-sm text-white/80">
                    온·습도 조정 및 박스 밀도 보정 시
                  </p>
                  <p className="text-lg font-bold text-white">
                    착과율 <span className="text-[#FFD55F]">최대 +10~15%p</span>
                  </p>
                  <p className="text-lg font-bold text-white">
                    연간 기대 수익 <span className="text-[#FFD55F]">약 +400~600만원</span> 증가
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-white/20 text-white/70 hover:text-white hover:bg-white/10 font-semibold px-5"
          onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : onNewReport()}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {currentPage === 1 ? "다시 작성" : "이전"}
        </Button>
        
        {currentPage < totalPages ? (
          <Button
            size="sm"
            className="rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold px-6 gap-1"
            onClick={() => setCurrentPage(currentPage + 1)}
            data-testid="button-next"
          >
            {currentPage === 1 ? "개선방안 보기" : "수익분석 보기"} <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            className="rounded-xl bg-[#FFD55F] hover:bg-[#ffcd3c] text-[#0A0E27] font-bold px-6"
            onClick={onNewReport}
            data-testid="button-complete"
          >
            진단 완료
          </Button>
        )}
      </div>
    </div>
  );
}
