'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import { KakaoMapProps } from '../model/model';

// 지도 컴포넌트를 지연 로딩
const Maps = lazy(() => import('./Map').then(module => ({ default: module.Maps })));

// 로딩 스켈레톤 컴포넌트
const MapSkeleton = () => (
  <div className="w-full h-full absolute inset-0 bg-gray-50" style={{ height: 'calc(100vh - 80px)' }}>
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
          <p className="text-gray-600 font-medium">지도 로딩 중...</p>
          <p className="text-gray-400 text-sm mt-1">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  </div>
);

// Intersection Observer를 사용한 지연 로딩 지도 컴포넌트
export const LazyMap = (props: KakaoMapProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 뷰포트에 들어온 후 약간의 지연을 두고 로딩 시작
          setTimeout(() => setShouldLoad(true), 100);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // 100px 미리 로딩
      }
    );

    const mapContainer = document.getElementById('lazy-map-container');
    if (mapContainer) {
      observer.observe(mapContainer);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      id="lazy-map-container"
      className="w-full h-full"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      {!isVisible ? (
        <MapSkeleton />
      ) : shouldLoad ? (
        <Suspense fallback={<MapSkeleton />}>
          <Maps {...props} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </div>
  );
};

export default LazyMap;