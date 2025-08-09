'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BusinessGroup, KakaoMapProps, Coordinates, MapState, MAP_CONFIG, ERROR_MESSAGES, LOADING_MESSAGES } from '../model/model';
import { loadKakaoMapScript, geocodeAddress, initializeKakaoMap, isKakaoMapLoaded } from '../api/api';

export const Maps = ({ products, selectedProductId, selectedProduct, onMarkerClick }: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // 맵 상태 관리
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    markers: [],
    businessGroups: [],
    businessCoordinates: new Map(),
    isKakaoLoaded: false,
    loadError: null
  });

  // 카카오 맵 지연 초기화 (LCP 최적화)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    
    if (!apiKey) {
      setMapState(prev => ({ ...prev, loadError: ERROR_MESSAGES.API_KEY_MISSING }));
      return;
    }

    if (isKakaoMapLoaded()) {
      setMapState(prev => ({ ...prev, isKakaoLoaded: true }));
      return;
    }

    // 5초 지연으로 LCP 측정 완료 후 로드
    const timer = setTimeout(() => {
      loadKakaoMapScript(apiKey)
        .then(() => {
          setMapState(prev => ({ ...prev, isKakaoLoaded: true }));
        })
        .catch((error) => {
          console.error('카카오 맵 로딩 실패:', error);
          setMapState(prev => ({ 
            ...prev, 
            loadError: error instanceof Error ? error.message : '지도 로드 실패' 
          }));
        });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 제품들을 업체별로 그룹화
  useEffect(() => {
    if (!products.length) return;

    const groupedByBusiness = products.reduce((acc, product) => {
      const businessId = product.businessId;
      
      if (!acc[businessId]) {
        acc[businessId] = {
          businessId,
          businessAddress: product.businessAddress || '',
          companyName: product.companyName || '업체명 없음',
          products: []
        };
      }
      
      acc[businessId].products.push(product);
      return acc;
    }, {} as Record<number, BusinessGroup>);

    setMapState(prev => ({ ...prev, businessGroups: Object.values(groupedByBusiness) }));
  }, [products]);

  // 맵 초기화
  useEffect(() => {
    if (!mapState.isKakaoLoaded || !mapContainer.current) return;

    const kakaoMap = initializeKakaoMap(
      mapContainer.current,
      MAP_CONFIG.DEFAULT_CENTER,
      MAP_CONFIG.DEFAULT_LEVEL
    );

    setMapState(prev => ({ ...prev, map: kakaoMap }));
  }, [mapState.isKakaoLoaded]);

  // 업체별 통합 마커 생성 함수
  const createBusinessMarker = useCallback((businessGroup: BusinessGroup, coordinates: Coordinates): unknown => {
    const markerPosition = new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng);
    
    // 선택된 물품이 이 업체에 있는지 확인
    const isSelected = businessGroup.products.some(p => p.id === selectedProductId);
    
    // 물품 개수에 따른 마커 크기 조정
    const productCount = businessGroup.products.length;
    const markerSize = Math.min(
      Math.max(MAP_CONFIG.MARKER_SIZE.MIN + (productCount * MAP_CONFIG.MARKER_SIZE.INCREMENT), MAP_CONFIG.MARKER_SIZE.MIN), 
      MAP_CONFIG.MARKER_SIZE.MAX
    );
    
    // 커스텀 마커 이미지 생성
    const markerColor = isSelected ? MAP_CONFIG.MARKER_COLORS.SELECTED : MAP_CONFIG.MARKER_COLORS.DEFAULT;
    const textColor = '#FFFFFF';
    
    const customMarkerImage = new window.kakao.maps.MarkerImage(
      'data:image/svg+xml;base64,' + btoa(`
        <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${markerSize/2}" cy="${markerSize/2}" r="${markerSize/2-2}" fill="${markerColor}" stroke="white" stroke-width="2"/>
          <text x="${markerSize/2}" y="${markerSize/2+4}" text-anchor="middle" fill="${textColor}" font-size="${Math.max(10, markerSize/4)}" font-weight="bold">${productCount}</text>
        </svg>
      `),
      new window.kakao.maps.Size(markerSize, markerSize),
      { offset: new window.kakao.maps.Point(markerSize/2, markerSize/2) }
    );

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: customMarkerImage,
      title: `${businessGroup.companyName} (${productCount}개 물품)`
    });

    // 마커 클릭 이벤트 
    window.kakao.maps.event.addListener(marker, 'click', () => {
      const firstProduct = businessGroup.products[0];
      onMarkerClick?.(firstProduct);
    });

    return marker;
  }, [selectedProductId, onMarkerClick]);

  // 업체별 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapState.map || !mapState.businessGroups.length) return;

    const createBusinessMarkers = async () => {
      // 기존 마커 제거
      setMapState(prev => {
        prev.markers.forEach(marker => {
          if (marker && typeof marker === 'object' && 'setMap' in marker) {
            (marker as { setMap: (map: unknown | null) => void }).setMap(null);
          }
        });
        return prev;
      });

      const newMarkers: unknown[] = [];
      const newCoordinatesMap = new Map<number, Coordinates>();

      for (const businessGroup of mapState.businessGroups) {
        if (!businessGroup.businessAddress) {
          console.warn('업체 주소 정보 없음:', businessGroup.companyName);
          continue;
        }

        try {
          const coordinates = await geocodeAddress(businessGroup.businessAddress);
          
          if (!coordinates) {
            console.warn(`좌표 변환 실패: ${businessGroup.companyName}`);
            continue;
          }

          // 좌표 저장
          newCoordinatesMap.set(businessGroup.businessId, coordinates);
          businessGroup.coordinates = coordinates;

          // 업체 마커 생성
          const marker = createBusinessMarker(businessGroup, coordinates);
          if (marker && typeof marker === 'object' && 'setMap' in marker) {
            (marker as { setMap: (map: unknown) => void }).setMap(mapState.map);
          }

          newMarkers.push(marker);

        } catch (error) {
          console.error(`업체 마커 생성 실패 (${businessGroup.companyName}):`, error);
        }
      }

      setMapState(prev => ({
        ...prev,
        markers: newMarkers,
        businessCoordinates: newCoordinatesMap
      }));
    };

    createBusinessMarkers();
  }, [mapState.map, mapState.businessGroups, createBusinessMarker]);

  // 선택된 물품의 업체 위치로 지도 이동
  useEffect(() => {
    if (!mapState.map || !selectedProduct) return;

    // 해당 업체의 저장된 좌표 사용
    const businessCoords = mapState.businessCoordinates.get(selectedProduct.businessId);
    if (businessCoords) {
      const moveLatLon = new window.kakao.maps.LatLng(businessCoords.lat, businessCoords.lng);
      
      // 타입 가드를 사용한 안전한 메서드 호출
      if (mapState.map && typeof mapState.map === 'object' && 'panTo' in mapState.map) {
        (mapState.map as { panTo: (latlng: unknown) => void }).panTo(moveLatLon);
        
        setTimeout(() => {
          if (mapState.map && typeof mapState.map === 'object' && 'setLevel' in mapState.map) {
            (mapState.map as { setLevel: (level: number) => void }).setLevel(MAP_CONFIG.SELECTED_LEVEL);
          }
        }, 500);
      }
      return;
    }

    // 저장된 좌표가 없으면 새로 변환
    if (selectedProduct.businessAddress) {
      geocodeAddress(selectedProduct.businessAddress).then(coordinates => {
        if (coordinates && mapState.map && typeof mapState.map === 'object' && 'panTo' in mapState.map) {
          const moveLatLon = new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng);
          (mapState.map as { panTo: (latlng: unknown) => void }).panTo(moveLatLon);
          
          setTimeout(() => {
            if (mapState.map && typeof mapState.map === 'object' && 'setLevel' in mapState.map) {
              (mapState.map as { setLevel: (level: number) => void }).setLevel(MAP_CONFIG.SELECTED_LEVEL);
            }
          }, 500);
          
          // 변환된 좌표 저장
          setMapState(prev => ({
            ...prev,
            businessCoordinates: new Map(prev.businessCoordinates).set(selectedProduct.businessId, coordinates)
          }));
        }
      });
    }
  }, [mapState.map, selectedProduct, mapState.businessCoordinates]);

  return (
    <div className="w-full h-full relative" style={{ height: 'calc(100vh - 80px)' }}>
      {/* 대형 콘텐츠 플레이스홀더 - LCP 최적화 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center"
        style={{ 
          width: '100%', 
          height: '100%',
          zIndex: !mapState.isKakaoLoaded ? 10 : 0,
          opacity: !mapState.isKakaoLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {mapState.loadError ? (
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">지도 로드 실패</h3>
            <p className="text-gray-600">{mapState.loadError}</p>
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">상품 위치 지도</h2>
            <p className="text-lg text-gray-600 mb-6">잠시만 기다려주세요</p>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                style={{ willChange: 'transform' }}
              />
              <p className="text-gray-700 font-medium">{LOADING_MESSAGES.MAP_LOADING}</p>
            </div>
            
            {/* 추가 시각적 콘텐츠 */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-xl mb-1">📍</div>
                <p className="text-gray-700">위치별 검색</p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-xl mb-1">🏪</div>
                <p className="text-gray-700">업체 정보</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: mapState.isKakaoLoaded && mapState.map ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        role="application"
        aria-label="상품 위치 지도"
      />
      
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2 z-[1000]">
        <button
          onClick={() => {
            if (mapState.map && typeof mapState.map === 'object' && 'getLevel' in mapState.map && 'setLevel' in mapState.map) {
              const currentLevel = (mapState.map as { getLevel: () => number }).getLevel();
              (mapState.map as { setLevel: (level: number) => void }).setLevel(currentLevel - 1);
            }
          }}
          aria-label="지도 확대"
          type="button"
          className="block w-10 h-10 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-400 cursor-pointer hover:text-blue-600 transition-all duration-200 font-bold text-lg"
        >
          +
        </button>
        <button
          onClick={() => {
            if (mapState.map && typeof mapState.map === 'object' && 'getLevel' in mapState.map && 'setLevel' in mapState.map) {
              const currentLevel = (mapState.map as { getLevel: () => number }).getLevel();
              (mapState.map as { setLevel: (level: number) => void }).setLevel(currentLevel + 1);
            }
          }}
          aria-label="지도 축소"
          type="button"
          className="block w-10 h-10 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-bold text-lg cursor-pointer"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Maps;