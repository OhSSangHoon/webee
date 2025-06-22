import { product } from '@/features/products/model/model';

// 업체 정보를 포함한 상품 타입
export interface ProductWithBusiness extends product {
  businessAddress?: string;
  companyName?: string;
}

// 사이드바 상태 타입
export interface SidebarState {
  isOpen: boolean;
  selectedBusinessId: number | null;
  selectedProductName: string;
  selectedProductId: number | null;
}


// 업체별 그룹화된 데이터 타입
export interface BusinessGroup {
  businessId: number;
  businessAddress: string;
  companyName: string;
  products: ProductWithBusiness[];
  coordinates?: { lat: number; lng: number };
}

// KakaoMap 컴포넌트의 Props
export interface KakaoMapProps {
  products: ProductWithBusiness[];
  selectedProductId?: number | null;
  selectedProduct?: ProductWithBusiness | null;
  onMarkerClick?: (product: ProductWithBusiness) => void;
}

// 좌표 정보
export interface Coordinates {
  lat: number;
  lng: number;
}

// 맵 초기화 옵션
export interface MapInitOptions {
  center: Coordinates;
  level: number;
}

// 마커 생성 옵션
export interface MarkerOptions {
  position: Coordinates;
  size: number;
  color: string;
  textColor: string;
  count: number;
  title: string;
}

// 맵 상태 관리
export interface MapState {
  map: any | null;
  markers: any[];
  businessGroups: BusinessGroup[];
  businessCoordinates: Map<number, Coordinates>;
  isKakaoLoaded: boolean;
  loadError: string | null;
}

// 맵 설정 상수
export const MAP_CONFIG = {
  // 대한민국 중심 좌표
  DEFAULT_CENTER: {
    lat: 35.8714,
    lng: 128.6014
  },
  // 기본 줌 레벨 (대한민국 전체 보기)
  DEFAULT_LEVEL: 12,
  // 상품 선택 시 줌 레벨
  SELECTED_LEVEL: 4,
  // 마커 크기 범위
  MARKER_SIZE: {
    MIN: 30,
    MAX: 50,
    INCREMENT: 2
  },
  // 마커 색상
  MARKER_COLORS: {
    DEFAULT: '#FF8800',
    SELECTED: '#FF4444'
  }
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'NEXT_PUBLIC_KAKAO_MAP_API_KEY가 설정되지 않았습니다.',
  SCRIPT_LOAD_FAILED: '카카오 맵 스크립트 로드 실패',
  KAKAO_OBJECT_NOT_FOUND: '카카오 맵 객체를 찾을 수 없습니다.',
  MAP_SERVICE_NOT_LOADED: '맵 서비스가 로드되지 않았습니다.'
} as const;

// 로딩 메시지 상수
export const LOADING_MESSAGES = {
  MAP_LOADING: '지도를 로딩 중입니다...'
} as const;

// Global Window 타입 확장
declare global {
  interface Window {
    kakao: any;
  }
}