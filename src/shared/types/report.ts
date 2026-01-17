import { z } from "zod";

export const reportInputSchema = z.object({
  location: z.string().min(1, "위치를 입력해주세요"),
  farmArea: z.number().optional(),
  crop: z.string().min(1, "작물을 선택해주세요"),
  cropVariety: z.string().optional(),
  hasGreenhouse: z.boolean().optional(),
  greenhouseCount: z.number().optional(),
  greenhouseSize: z.number().optional(),
  beeBrand: z.string().optional(),
  boxesPerHouse: z.number().optional(),
  replacementWeeks: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  monthlyKg: z.number().optional(),
  annualRevenue: z.number().optional(),
  annualKg: z.number().optional(),
  hasSmartFarm: z.boolean().optional(),
  averageTemperature: z.number().optional(),
  averageHumidity: z.number().optional(),
});

export type ReportInput = z.infer<typeof reportInputSchema>;

// API Request/Response Types
export interface HarvestPredictionRequest {
  farmBaseInfo: {
    region: string;
    areaPyeong: number;
    cropName: string;
    cropVariety: string;
  };
  greenhouseSetup: {
    houseCount: number;
    areaPerHousePyeong: number;
    beeType: string;
    boxesPerHouse: number;
    replacementCycleWeeks: number;
    annualYieldKg: number;
  };
  environmentData?: {
    temperature?: number;
    humidity?: number;
  };
}

export interface BeeRecommendation {
  name: string;
  price: number;
  replacementCycleWeeks: number;
  activityRate: number;
  optimalTemperature?: {
    min: number;
    max: number;
  };
  tags: string[];
}

export interface HarvestPredictionResponse {
  code: string;
  message: string;
  data: {
    summaryScore: {
      score: number;
      percentile: number;
    };
    recommendation: {
      best: BeeRecommendation;
      alternatives: BeeRecommendation[];
    };
    environmentDiagnosis?: {
      temperature: {
        current: number;
        optimal: { min: number; max: number };
        status: string;
      };
      humidity: {
        current: number;
        optimal: { min: number; max: number };
        status: string;
      };
      alerts: string[];
    };
    priorityIssues?: Array<{
      rank: number;
      title: string;
      description: string;
    }>;
    managementGuide?: {
      temperatureControl: {
        currentRange: string;
        recommendedRange: string;
        actions: string[];
      };
      humidityControl: {
        currentRange: string;
        recommendedRange: string;
        actions: string[];
      };
      pollinationManagement: {
        placement: string;
        replacementCycle: string;
        additionalTips: string[];
      };
    };
    expectedRevenue?: {
      marketPricePerKg: number;
      annualProductionKg: number;
      currentPollinationRate: number;
      improvedPollinationRate: number;
      additionalProductionKg: number;
      additionalRevenue: number;
      additionalCost: {
        min: number;
        max: number;
      };
      netGainRange: {
        min: number;
        max: number;
      };
      roiPercentRange: {
        min: number;
        max: number;
      };
    };
    finalConclusion?: {
      suitability: string;
      expectedImprovementRate: {
        min: number;
        max: number;
      };
      expectedAnnualRevenueIncrease: {
        min: number;
        max: number;
      };
    };
  };
}

export interface CompatibilityResult {
  status: "suitable" | "warning" | "unsuitable";
  brandCropMatch: string;
  densityAssessment: string;
  recommendation: string;
}

export interface EnvironmentResult {
  temperatureStatus: "optimal" | "warning" | "critical";
  humidityStatus: "optimal" | "warning" | "critical";
  temperatureRange: { min: number; max: number; current?: number };
  humidityRange: { min: number; max: number; current?: number };
  diagnosis: string[];
  recommendation: string;
}

export interface ManagementAction {
  icon: string;
  title: string;
  target: string;
  methods: string[];
}

export interface RevenueAnalysis {
  currentRate: number;
  improvedRate: number;
  maxRate: number;
  currentYield: number;
  improvedYield: number;
  additionalYield: number;
  currentRevenue: number;
  additionalRevenue: number;
  additionalCost: number;
  netProfit: number;
  roi: number;
}

export interface BrandComparison {
  brand1: {
    name: string;
    price?: number;
    activityRate?: number;
    replacementCycleWeeks?: number;
    optimalTemperature?: { min: number; max: number };
    features: string[];
    suitability: string;
  };
  brand2: {
    name: string;
    price?: number;
    activityRate?: number;
    replacementCycleWeeks?: number;
    optimalTemperature?: { min: number; max: number };
    features: string[];
    suitability: string;
  };
}

// API 원본 데이터 타입
export interface ManagementGuideRaw {
  temperatureControl: {
    currentRange: string;
    recommendedRange: string;
    actions: string[];
  };
  humidityControl: {
    currentRange: string;
    recommendedRange: string;
    actions: string[];
  };
  pollinationManagement: {
    placement: string;
    replacementCycle: string;
    additionalTips: string[];
  };
}

export interface ExpectedRevenueRaw {
  marketPricePerKg: number;
  annualProductionKg: number;
  currentPollinationRate: number;
  improvedPollinationRate: number;
  additionalProductionKg: number;
  additionalRevenue: number;
  additionalCost: { min: number; max: number };
  netGainRange: { min: number; max: number };
  roiPercentRange: { min: number; max: number };
}

export interface FinalConclusionRaw {
  suitability: string;
  expectedImprovementRate: { min: number; max: number };
  expectedAnnualRevenueIncrease: { min: number; max: number };
}

export interface ReportResult {
  input: ReportInput;
  compatibility: CompatibilityResult;
  environment?: EnvironmentResult;
  managementActions: ManagementAction[];
  revenueAnalysis: RevenueAnalysis;
  brandComparison?: BrandComparison;
  summary: string;
  // LLM 응답 원본 데이터
  managementGuide?: ManagementGuideRaw;
  expectedRevenue?: ExpectedRevenueRaw;
  finalConclusion?: FinalConclusionRaw;
}

export const cropOptions = [
  { value: "strawberry", label: "딸기" },
  { value: "tomato", label: "토마토" },
  { value: "pepper", label: "고추" },
  { value: "melon", label: "멜론" },
  { value: "watermelon", label: "수박" },
  { value: "cucumber", label: "오이" },
];

export const strawberryVarieties = [
  { value: "seolhyang", label: "설향" },
  { value: "maehyang", label: "매향" },
  { value: "kuemsil", label: "금실" },
  { value: "santa", label: "산타" },
];

export const beeBrands = [
  { value: "jirisan", label: "지리산 수정벌" },
  { value: "maya", label: "마야 수정벌" },
  { value: "koreannet", label: "코리아넷 수정벌" },
];