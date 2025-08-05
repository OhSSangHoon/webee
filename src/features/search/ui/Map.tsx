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

  // 카카오 맵 API 로드 (최적화됨)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    
    if (!apiKey) {
      setMapState(prev => ({ ...prev, loadError: ERROR_MESSAGES.API_KEY_MISSING }));
      return;
    }

    // 즉시 로딩 상태를 확인하고 빠르게 처리
    const initializeMap = async () => {
      try {
        if (isKakaoMapLoaded()) {
          setMapState(prev => ({ ...prev, isKakaoLoaded: true, loadError: null }));
          return;
        }

        // 병렬로 스크립트 로드 시작
        await loadKakaoMapScript(apiKey);
        setMapState(prev => ({ ...prev, isKakaoLoaded: true, loadError: null }));
      } catch (error) {
        console.error('카카오 맵 로딩 실패:', error);
        setMapState(prev => ({ 
          ...prev, 
          loadError: error instanceof Error ? error.message : '알 수 없는 오류' 
        }));
      }
    };

    initializeMap();
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

    const groupsArray = Object.values(groupedByBusiness);
    setMapState(prev => ({ ...prev, businessGroups: groupsArray }));
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
      // 기존 마커 제거 (현재 상태에서 가져오기)
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

  if (!mapState.isKakaoLoaded) {
    return (
      <div className="w-full h-full absolute inset-0 bg-gray-50" style={{ height: 'calc(100vh - 80px)' }}>
        {mapState.loadError ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-red-600 text-center">
              <div className="text-xl mb-2" aria-hidden="true">⚠️</div>
              <p className="font-medium mb-2">카카오 맵 로드 실패</p>
              <p className="text-sm mb-4">{mapState.loadError}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* 스켈레톤 지도 UI */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* 가상 지도 타일들 */}
              <div className="grid grid-cols-4 grid-rows-4 h-full gap-1 p-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-300 animate-pulse rounded" 
                    style={{ 
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
              
              {/* 가상 마커들 */}
              <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-red-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* 로딩 오버레이 */}
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center bg-white rounded-lg p-4 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 font-medium">{LOADING_MESSAGES.MAP_LOADING}</p>
                <p className="text-gray-400 text-sm mt-1">지도 데이터를 불러오는 중...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: 'calc(100vh - 80px)'
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
          className="block w-10 h-10 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-400  cursor-pointer hover:text-blue-600 transition-all duration-200 font-bold text-lg"
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
          className="block w-10 h-10 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-bold text-lg  cursor-pointer"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Maps;