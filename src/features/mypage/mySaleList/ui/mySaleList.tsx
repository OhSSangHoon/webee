"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useMySaleList } from "../model/model";
import { ProductCard } from "./productCards";
import { NavigationButton } from "./navButton";

export default function MySaleList() {
  const { myProducts, visibleProducts, slideInfo, isLoading, error, actions } =
    useMySaleList();
  
  const [itemsToShow, setItemsToShow] = useState(2);

  // 화면 크기에 따른 아이템 개수 설정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(2);
      }
    };

    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 가격 포맷팅 함수
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  }, []);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="custom-box2 w-full h-full flex flex-col justify-center items-center pb-10">
        <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <div className="text-gray-500">상품 목록을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="custom-box2 w-full h-full flex flex-col justify-center items-center pb-10">
        <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-red-500 mb-3">{error}</div>
            <button
              onClick={actions.retry}
              className="text-blue-500 hover:underline text-sm bg-blue-50 px-3 py-1 rounded transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (!isLoading && myProducts.length === 0) {
    return (
      <div className="custom-box2 w-full h-full flex flex-col justify-center items-center">
        <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-4xl mb-4">📦</div>
            <div className="text-gray-500 mb-4">등록한 상품이 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box2 shadow-lg flex flex-col w-full overflow-hidden" style={{contain: 'layout style'}}>
      <div className="custom-box2-title mb-4">
        <span className="custom-box2-icon">🛒</span> 내 상품 목록
      </div>

      {/* 반응형 컨테이너 - layout shift 방지 */}
      <div className="relative w-full px-4 sm:px-6 lg:px-10 py-4" style={{contain: 'layout'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center min-h-[250px]" style={{contain: 'layout'}}>
          {visibleProducts.slice(0, itemsToShow).map((product, index) => (
            <div
              key={product.id}
              className="w-full max-w-[280px] flex justify-center"
              style={{contain: 'layout'}}
            >
              <ProductCard
                product={product}
                index={index}
                formatPrice={formatPrice}
              />
            </div>
          ))}
        </div>

        {/* 네비게이션 버튼 */}
        {myProducts.length > visibleProducts.length && (
          <div className="flex justify-between items-center mt-6">
            {/* 이전 버튼 */}
            <NavigationButton
              direction="prev"
              onClick={actions.goPrev}
              disabled={!slideInfo.canGoPrev}
            />

            {/* 다음 버튼 */}
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