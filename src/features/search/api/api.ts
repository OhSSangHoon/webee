import api from "@/shared/auth/lib";
import { productResponse } from "@/features/products/model/model";
import { Coordinates, KakaoGeocodeResult } from "../model/model";

// 전체 상품 조회
export async function getAllProducts() {
    const response = await api.get<productResponse>('/products');
    return response.data;
}

// 업체별 상품 조회
export async function getProductsByBusiness(businessId: number) {
    const response = await api.get<productResponse>(`/products?businessId=${businessId}`);
    return response.data;
}

// 벌 종류별 상품 조회
export async function getProductsByBeeType(beeType: string) {
    const response = await api.get<productResponse>(`/products?bee=${beeType}`);
    return response.data;
}

// 페이징과 함께 상품 조회
export async function getProductsWithPaging(params: {
    page?: number;
    size?: number;
    businessId?: number;
    bee?: string;
    sort?: string;
}) {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.businessId) searchParams.append('businessId', params.businessId.toString());
    if (params.bee) searchParams.append('bee', params.bee);
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await api.get<productResponse>(`/products?${searchParams.toString()}`);
    return response.data;
}

// 카카오맵 유틸리티 함수들

// 카카오맵 스크립트 로드
export const loadKakaoMapScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 기존 스크립트가 있으면 제거
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          resolve();
        });
      } else {
        reject(new Error('카카오 맵 객체를 찾을 수 없습니다.'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('카카오 맵 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

// 주소를 좌표로 변환
export const geocodeAddress = (address: string): Promise<Coordinates | null> => {
  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('맵 서비스가 로드되지 않았습니다.');
      resolve(null);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, (result: KakaoGeocodeResult[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const coordinates: Coordinates = {
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        };
        resolve(coordinates);
      } else {
        console.warn(`주소 변환 실패: ${address}, 상태: ${status}`);
        resolve(null);
      }
    });
  });
};

// 카카오맵 초기화
export const initializeKakaoMap = (
  container: HTMLDivElement,
  centerLocation: Coordinates,
  level: number
): unknown => {
  if (!window.kakao || !window.kakao.maps) {
    throw new Error('카카오맵이 로드되지 않았습니다.');
  }

  const mapOption = {
    center: new window.kakao.maps.LatLng(centerLocation.lat, centerLocation.lng),
    level
  };

  return new window.kakao.maps.Map(container, mapOption);
};

// 카카오맵이 로드되었는지 확인
export const isKakaoMapLoaded = (): boolean => {
  return !!(window.kakao && window.kakao.maps && window.kakao.maps.services);
};

// 마커 생성 헬퍼 함수
export const createKakaoMarker = (
  position: Coordinates,
  map: unknown,
  options?: Record<string, unknown>
): unknown => {
  if (!window.kakao || !window.kakao.maps) {
    throw new Error('카카오맵이 로드되지 않았습니다.');
  }

  const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng);
  
  const markerOptions = {
    position: markerPosition,
    map: map,
    ...options
  };

  return new window.kakao.maps.Marker(markerOptions);
};

// 커스텀 오버레이 생성 헬퍼 함수
export const createKakaoCustomOverlay = (
  position: Coordinates,
  content: string | HTMLElement,
  map: unknown,
  options?: Record<string, unknown>
): unknown => {
  if (!window.kakao || !window.kakao.maps) {
    throw new Error('카카오맵이 로드되지 않았습니다.');
  }

  const overlayPosition = new window.kakao.maps.LatLng(position.lat, position.lng);
  
  const overlayOptions = {
    position: overlayPosition,
    content: content,
    map: map,
    ...options
  };

  return new window.kakao.maps.CustomOverlay(overlayOptions);
};