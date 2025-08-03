"use client";

import React, { useCallback } from "react";
import { useMySaleList } from "../model/model";
import { ProductCard } from "./productCards";
import { NavigationButton } from "./navButton";

export default function MySaleList() {
  const { myProducts, visibleProducts, slideInfo, isLoading, error, actions } =
    useMySaleList();

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
    <div className="custom-box2 flex flex-col">
      <div className="custom-box2-title mb-4">
        <span className="custom-box2-icon">🛒</span> 내가 등록한 상품 목록
      </div>

      {/* 슬라이드 컨테이너 */}
      <div className="relative w-full px-10 py-4">
        {/* 상품 슬라이드 */}
        <div className="flex flex-row justify-between items-center w-full gap-2">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              formatPrice={formatPrice}
            />
          ))}
        </div>

        {/* 좌우 네비게이션 버튼 */}
        {myProducts.length > 4 && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
