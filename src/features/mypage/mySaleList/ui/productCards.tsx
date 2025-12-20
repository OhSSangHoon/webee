import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { ProductWithBusiness } from "@/features/search/model/model";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { useRouter } from "next/navigation";

/**
 * 상품 카드 컴포넌트
 */
interface ProductCardProps {
  product: ProductWithBusiness;
  index: number;
  formatPrice: (price: number) => string;
}

export const ProductCard = memo<ProductCardProps>(
  ({ product, index, formatPrice }) => {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    
    const handleImageError = useCallback(() => {
      setImageError(true);
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

    // 이미지 URL
    const optimizedImageUrl = product.imageUrls?.[0];

    return (
      <article className="group relative w-full bg-white rounded-lg">
        <button
          className="w-full cursor-pointer rounded-lg border-none text-left"
          onClick={handleCardClick}
          onKeyDown={handleKeyPress}
          aria-label={`${product.name} 상품 상세보기`}
        >
          <div className="flex items-center gap-3">
            {/* 상품 이미지 영역 */}
            <div className="relative w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {optimizedImageUrl && !imageError ? (
                <Image
                  src={optimizedImageUrl}
                  alt={`${product.name} 상품 이미지`}
                  fill
                  className="object-cover transition-transform duration-300"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  onError={handleImageError}
                  sizes="100px"
                  placeholder="empty"
                  unoptimized={true}
                  quality={85}
                />
              ) : (
                // 이미지 없음 또는 에러 상태
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">이미지 없음</span>
                </div>
              )}
            </div>

            {/* 상품 정보 영역 */}
            <div className="flex-1 flex flex-col justify-center gap-2 py-1">
              {/* 수정벌 타입 */}
              <span className="inline-block px-2 py-1 bg-main-400 text-main-900 rounded-lg text-xs font-semibold w-fit">
                {getBeeTypeKorean(product.beeType)}
              </span>

              {/* 상품명 */}
              <h3
                className="h-[40px] text-base font-medium text-gray-900 line-clamp-2 leading-tight transition-colors duration-200"
                title={product.name}
              >
                {product.name}
              </h3>

              {/* 가격 */}
              <div className="text-base font-bold text-sub-900">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
        </button>
      </article>
    );
  }
);

ProductCard.displayName = "ProductCard";