import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { ProductWithBusiness } from "@/features/search/model/model";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { useRouter } from "next/navigation";

/**
 * 상품 카드 컴포넌트
 * @param product - 상품 정보
 * @param index - 상품 인덱스
 * @param formatPrice - 가격 포맷팅 함수
 */
interface ProductCardProps {
  product: ProductWithBusiness;
  index: number;
  formatPrice: (price: number) => string;
}

export const ProductCard = memo<ProductCardProps>(
  ({ product, index, formatPrice }) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const router = useRouter();

    const handleImageLoad = useCallback(() => {
      setIsImageLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setIsImageLoading(false);
    }, []);

    const handleCardClick = useCallback(() => {
      router.push(`/products/${product.id}`);
    }, [router, product.id]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardClick();
      }
    }, [handleCardClick]);

    return (
      <article 
        className="group relative w-full max-w-[280px] h-[320px] sm:h-[300px] lg:h-[280px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 mx-auto isolate transform-gpu will-change-transform"
        onClick={handleCardClick}
        onKeyDown={handleKeyPress}
        role="button"
        tabIndex={0}
        aria-label={`${product.name} 상품 상세보기`}
      >
        {/* 상품 이미지 영역 */}
        <div className="relative w-full h-[200px] sm:h-[180px] lg:h-[160px] min-h-[160px] overflow-hidden rounded-t-lg bg-gray-100 isolate transform-gpu">
          {/* 로딩 상태 - 고정 크기로 layout shift 방지 */}
          {isImageLoading && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 isolate">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-xs text-gray-500">로딩중...</span>
              </div>
            </div>
          )}

          {/* 이미지 영역 - layout shift 방지를 위한 고정 크기 */}
          {product.imageUrls && product.imageUrls.length > 0 && !imageError ? (
            <Image
              src={product.imageUrls[0]}
              alt={`${product.name} 상품 이미지`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index === 0} // 첫 번째 상품은 우선 로딩 
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 640px) 280px, (max-width: 768px) 140px, 280px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg"
              className="object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 isolate">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">이미지 없음</span>
            </div>
        )}
        </div>

        {/* 상품 정보 영역 - 고정 높이로 layout shift 방지 */}
        <div className="p-3 sm:p-4 h-[120px] sm:h-[120px] lg:h-[120px] flex flex-col justify-between isolate">
          <div className="space-y-1 sm:space-y-2">
            {/* 상품명 */}
            <h3 
              className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-blue-600 transition-colors duration-200"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* 가격 */}
            <div className="text-base sm:text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium truncate max-w-[80px] sm:max-w-[100px]">
                {getBeeTypeKorean(product.beeType)}
              </span>
            </div>
            <div className="truncate max-w-[60px] sm:max-w-[80px]" title={product.origin}>
              {product.origin}
            </div>
          </div>
        </div>

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      </article>
    );
  }
);

ProductCard.displayName = "ProductCard";