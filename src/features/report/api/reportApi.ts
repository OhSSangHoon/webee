import type {
  ReportInput,
  ReportResult,
  HarvestPredictionRequest,
  HarvestPredictionResponse,
  ManagementAction
} from "@/shared/types/report";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 영문 → 한글 변환 매핑
export const CROP_NAME_MAP: Record<string, string> = {
  "strawberry": "딸기",
  "tomato": "토마토",
  "pepper": "고추",
  "melon": "멜론",
  "watermelon": "수박",
  "cucumber": "오이",
};

export const CROP_VARIETY_MAP: Record<string, string> = {
  "seolhyang": "설향",
  "maehyang": "매향",
  "kuemsil": "금실",
  "santa": "산타",
};

export const BEE_TYPE_MAP: Record<string, string> = {
  "jirisan": "지리산 수정벌",
  "maya": "마야 수정벌",
  "koreannet": "코리아넷 수정벌",
};

/**
 * ReportInput을 API 요청 형식으로 변환
 */
function transformToApiRequest(input: ReportInput): HarvestPredictionRequest {
  const cropName = CROP_NAME_MAP[input.crop] || input.crop;
  const cropVariety = input.cropVariety ? (CROP_VARIETY_MAP[input.cropVariety] || input.cropVariety) : "";
  const beeType = input.beeBrand ? (BEE_TYPE_MAP[input.beeBrand] || input.beeBrand) : "지리산 수정벌";

  return {
    farmBaseInfo: {
      region: input.location,
      areaPyeong: input.farmArea || 1000,
      cropName: cropName,
      cropVariety: cropVariety,
    },
    greenhouseSetup: {
      houseCount: input.greenhouseCount || 1,
      areaPerHousePyeong: input.greenhouseSize || 330,
      beeType: beeType,
      boxesPerHouse: input.boxesPerHouse || 3,
      replacementCycleWeeks: input.replacementWeeks || 3,
      annualYieldKg: input.annualKg || 5000,
    },
    environmentData: input.hasSmartFarm ? {
      temperature: input.averageTemperature,
      humidity: input.averageHumidity,
    } : undefined,
  };
}

/**
 * API 응답을 ReportResult 형식으로 변환
 */
function transformToReportResult(
  input: ReportInput,
  apiResponse: HarvestPredictionResponse
): ReportResult {
  const { data } = apiResponse;

  const hasEnvironmentData = data.environmentDiagnosis !== undefined;

  const mapStatus = (status: string): "optimal" | "warning" | "critical" => {
    const statusLower = status.toLowerCase();
    if (statusLower === "normal" || statusLower === "optimal") return "optimal";
    if (statusLower === "high" || statusLower === "low") return "warning";
    return "critical";
  };

  const managementActions: ManagementAction[] = [];

  if (data.managementGuide) {
    const { temperatureControl, humidityControl, pollinationManagement } = data.managementGuide;

    managementActions.push({
      icon: "thermometer",
      title: "온도 관리",
      target: `권장 범위: ${temperatureControl.recommendedRange}`,
      methods: temperatureControl.actions,
    });

    managementActions.push({
      icon: "droplets",
      title: "습도 관리",
      target: `권장 범위: ${humidityControl.recommendedRange}`,
      methods: humidityControl.actions,
    });

    managementActions.push({
      icon: "bee",
      title: "수정벌 관리",
      target: pollinationManagement.replacementCycle,
      methods: [pollinationManagement.placement, ...pollinationManagement.additionalTips],
    });
  }

  return {
    input,
    compatibility: {
      status: data.summaryScore.score >= 80 ? "suitable" : data.summaryScore.score >= 60 ? "warning" : "unsuitable",
      brandCropMatch: `${data.recommendation.best.name}은(는) ${input.crop}에 적합하며, ${data.recommendation.best.tags.join(", ")} 특성을 가지고 있습니다.`,
      densityAssessment: `현재 최적 수정벌: ${data.recommendation.best.name} (활동성: ${data.recommendation.best.activityRate}%)`,
      recommendation: `수정벌 관리 최적화 점수: ${data.summaryScore.score}점 (상위 ${data.summaryScore.percentile}%)`,
    },
    environment: hasEnvironmentData ? {
      temperatureStatus: mapStatus(data.environmentDiagnosis!.temperature.status),
      humidityStatus: mapStatus(data.environmentDiagnosis!.humidity.status),
      temperatureRange: {
        min: data.environmentDiagnosis!.temperature.optimal.min,
        max: data.environmentDiagnosis!.temperature.optimal.max,
        current: data.environmentDiagnosis!.temperature.current,
      },
      humidityRange: {
        min: data.environmentDiagnosis!.humidity.optimal.min,
        max: data.environmentDiagnosis!.humidity.optimal.max,
        current: data.environmentDiagnosis!.humidity.current,
      },
      diagnosis: data.environmentDiagnosis!.alerts || [],
      recommendation: data.environmentDiagnosis!.alerts.length > 0
        ? "환경 개선이 필요합니다. 아래 가이드를 참고하세요."
        : "현재 환경은 수정벌 활동에 최적입니다.",
    } : undefined,
    managementActions,
    revenueAnalysis: data.expectedRevenue ? {
      currentRate: data.expectedRevenue.currentPollinationRate,
      improvedRate: data.expectedRevenue.improvedPollinationRate,
      maxRate: 95,
      currentYield: data.expectedRevenue.annualProductionKg,
      improvedYield: data.expectedRevenue.annualProductionKg + data.expectedRevenue.additionalProductionKg,
      additionalYield: data.expectedRevenue.additionalProductionKg,
      currentRevenue: data.expectedRevenue.annualProductionKg * data.expectedRevenue.marketPricePerKg,
      additionalRevenue: data.expectedRevenue.additionalRevenue,
      additionalCost: (data.expectedRevenue.additionalCost.min + data.expectedRevenue.additionalCost.max) / 2,
      netProfit: (data.expectedRevenue.netGainRange.min + data.expectedRevenue.netGainRange.max) / 2,
      roi: (data.expectedRevenue.roiPercentRange.min + data.expectedRevenue.roiPercentRange.max) / 2,
    } : {
      currentRate: 80,
      improvedRate: 90,
      maxRate: 95,
      currentYield: input.annualKg || 5000,
      improvedYield: (input.annualKg || 5000) * 1.125,
      additionalYield: (input.annualKg || 5000) * 0.125,
      currentRevenue: (input.annualKg || 5000) * 15000,
      additionalRevenue: (input.annualKg || 5000) * 0.125 * 15000,
      additionalCost: 2500000,
      netProfit: ((input.annualKg || 5000) * 0.125 * 15000) - 2500000,
      roi: 100,
    },
    brandComparison: {
      brand1: {
        name: data.recommendation.best.name,
        price: data.recommendation.best.price,
        activityRate: data.recommendation.best.activityRate,
        replacementCycleWeeks: data.recommendation.best.replacementCycleWeeks,
        optimalTemperature: data.recommendation.best.optimalTemperature,
        features: data.recommendation.best.tags,
        suitability: `최적 온도: ${data.recommendation.best.optimalTemperature?.min}~${data.recommendation.best.optimalTemperature?.max}°C`,
      },
      brand2: data.recommendation.alternatives[0] ? {
        name: data.recommendation.alternatives[0].name,
        price: data.recommendation.alternatives[0].price,
        activityRate: data.recommendation.alternatives[0].activityRate,
        replacementCycleWeeks: data.recommendation.alternatives[0].replacementCycleWeeks,
        optimalTemperature: data.recommendation.alternatives[0].optimalTemperature,
        features: data.recommendation.alternatives[0].tags || [],
        suitability: data.recommendation.alternatives[0].optimalTemperature
          ? `최적 온도: ${data.recommendation.alternatives[0].optimalTemperature.min}~${data.recommendation.alternatives[0].optimalTemperature.max}°C`
          : `${data.recommendation.alternatives[0].name} - 활동성 ${data.recommendation.alternatives[0].activityRate}%`,
      } : {
        name: "대안 없음",
        features: [],
        suitability: "",
      },
    },
    summary: data.finalConclusion?.suitability
      ? `${data.finalConclusion.suitability} - 예상 연간 수익 증가: ${data.finalConclusion.expectedAnnualRevenueIncrease.min.toLocaleString()}~${data.finalConclusion.expectedAnnualRevenueIncrease.max.toLocaleString()}원`
      : `수정벌 관리 최적화 점수: ${data.summaryScore.score}점. ${data.recommendation.best.name}을(를) 사용하여 수확량 증대를 기대할 수 있습니다.`,
  };
}

/**
 * 리포트 생성 API 호출
 */
export async function generateReport(input: ReportInput): Promise<ReportResult> {
  const requestBody = transformToApiRequest(input);

  // 로그인 상태 확인
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 토큰이 있으면 추가 (로그인 상태)
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/reports/harvest-prediction`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const apiResponse: HarvestPredictionResponse = await response.json();

  return transformToReportResult(input, apiResponse);
}