"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useMySaleList } from "../model/model";
import { ProductCard } from "./productCards";
import { NavigationButton } from "./navButton";

// 스켈레톤 카드 컴포넌트 - 단순화
const SkeletonProductCard: React.FC = () => (
  <div className="w-full max-w-[280px] flex justify-center isolate transform-gpu">
    <div className="w-full h-[320px] sm:h-[300px] lg:h-[280px] bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* 이미지 영역 */}
      <div className="w-full h-[200px] sm:h-[180px] lg:h-[160px] bg-gray-200 rounded-t-lg animate-pulse"></div>
      
      {/* 컨텐츠 영역 */}
      <div className="p-3 sm:p-4 h-[120px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// 빈 상태 컴포넌트
const EmptyState: React.FC = () => (
  <div className="col-span-full flex items-center justify-center min-h-[250px]">
    <div className="text-center">
      <div className="text-4xl mb-4">📦</div>
      <div className="text-gray-500 mb-4">등록한 상품이 없습니다.</div>
    </div>
  </div>
);

// 에러 상태 컴포넌트
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="col-span-full flex items-center justify-center min-h-[250px]">
    <div className="text-center">
      <div className="text-red-500 mb-3">{error}</div>
      <button
        onClick={onRetry}
        className="text-blue-500 hover:underline text-sm bg-blue-50 px-3 py-1 rounded transition-colors"
      >
        다시 시도
      </button>
    </div>
  </div>
);

export default function MySaleList() {
  const { myProducts, visibleProducts, slideInfo, isLoading, error, actions } = useMySaleList();
  const [itemsToShow, setItemsToShow] = useState(1);

  // 반응형 설정 - 최적화
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      
      if (width >= 1024) {
        setItemsToShow(3);
      } else if (width >= 768) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    updateItemsToShow();
    
    // 디바운스된 리사이즈 핸들러
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateItemsToShow, 150);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 가격 포맷팅 함수
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  }, []);

  // 반응형 그리드 클래스 - 메모이제이션
  const gridClasses = useMemo(() => 
    "grid gap-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
  []);

  return (
    <div className="custom-box2 shadow-lg flex flex-col w-full overflow-hidden isolate transform-gpu">
      {/* 헤더 */}
      <div className="custom-box2-title mb-4 flex-shrink-0">
        <span className="custom-box2-icon">🛒</span> 내 상품 목록
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative w-full px-4 sm:px-6 lg:px-10 py-4 isolate flex-1">
        {/* 반응형 그리드 컨테이너 */}
        <div 
          className={`${gridClasses} isolate transform-gpu`}
          style={{ minHeight: '280px' }}
        >
          {/* 로딩 상태 */}
          {isLoading && (
            Array.from({ length: itemsToShow }, (_, index) => (
              <SkeletonProductCard key={`skeleton-${index}`} />
            ))
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <ErrorState error={error} onRetry={actions.retry} />
          )}

          {/* 빈 상태 */}
          {!isLoading && !error && myProducts.length === 0 && (
            <EmptyState />
          )}

          {/* 실제 상품 목록 - 최적화된 렌더링 */}
          {!isLoading && !error && myProducts.length > 0 && (
            <>
              {visibleProducts.slice(0, itemsToShow).map((product, index) => (
                <div
                  key={product.id}
                  className="w-full max-w-[280px] flex justify-center isolate transform-gpu"
                >
                  <ProductCard
                    product={product}
                    index={index}
                    formatPrice={formatPrice}
                    itemsToShow={itemsToShow}
                  />
                </div>
              ))}
              
              {/* 빈 슬롯 채우기 - 데스크톱에서만 */}
              {itemsToShow > 1 && visibleProducts.length < itemsToShow && (
                Array.from({ length: itemsToShow - visibleProducts.length }, (_, index) => (
                  <div key={`empty-${index}`} className="w-full max-w-[280px] hidden md:block"></div>
                ))
              )}
            </>
          )}
        </div>

        {/* 네비게이션 버튼 */}
        {!isLoading && !error && myProducts.length > itemsToShow && (
          <div className="flex justify-between items-center mt-6">
            <NavigationButton
              direction="prev"
              onClick={actions.goPrev}
              disabled={!slideInfo.canGoPrev}
            />

            <NavigationButton
              direction="next"
              onClick={actions.goNext}
              disabled={!slideInfo.canGoNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}