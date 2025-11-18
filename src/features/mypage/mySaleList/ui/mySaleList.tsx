"use client";

import React, { useCallback } from "react";
import { useMySaleList } from "../model/model";
import { ProductCard } from "./productCards";


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
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry
}) => (
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
  const {
    myProducts,
    visibleProducts,
    isLoading,
    error,
    actions
  } = useMySaleList();

  // 가격 포맷팅 함수
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  }, []);

  return (
    <div className="flex flex-col w-full my-8">
      {/* 헤더 */}
      <div className="flex-shrink-0">
        <span className="text-lg font-semibold text-gray-900">내 상품 목록</span>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative w-full py-2 isolate flex-1">
        <div className="grid gap-2 justify-items-center grid-cols-1">

          {/* 에러 상태 */}
          {error && !isLoading && (
            <ErrorState error={error} onRetry={actions.retry} />
          )}

          {/* 빈 상태 */}
          {!isLoading && !error && myProducts.length === 0 && (
            <EmptyState />
          )}

          {/* 실제 상품 목록 */}
          {!isLoading && !error && myProducts.length > 0 && (
            <>
              {visibleProducts.slice(0, 3).map((product, index) => (
                <div
                  key={product.id}
                  className="w-full flex justify-center"
                >
                  <ProductCard
                    product={product}
                    index={index}
                    formatPrice={formatPrice}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}