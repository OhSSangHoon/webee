import React, { useState, useCallback, memo, useEffect } from "react";
import Image from "next/image";
import { ProductWithBusiness } from "@/features/search/model/model";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { useRouter } from "next/navigation";

/**
 * LCP 최적화된 상품 카드 컴포넌트
 */
interface ProductCardProps {
  product: ProductWithBusiness;
  index: number;
  formatPrice: (price: number) => string;
  itemsToShow: number; // 현재 화면에 표시되는 아이템 수
}

export const ProductCard = memo<ProductCardProps>(
  ({ product, index, formatPrice, itemsToShow }) => {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    // Above-the-fold 이미지 판단 (현재 화면에 보이는 아이템들)
    const isAboveFold = index < itemsToShow;
    
    // CloudFront 도메인 preconnect (최초 렌더링 시 한 번만)
    useEffect(() => {
      if (isAboveFold && index === 0) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://d96w70pr33mqi.cloudfront.net';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        
        const dnsLink = document.createElement('link');
        dnsLink.rel = 'dns-prefetch';
        dnsLink.href = 'https://d96w70pr33mqi.cloudfront.net';
        document.head.appendChild(dnsLink);
      }
    }, [isAboveFold, index]);
    
    // 첫 번째 이미지 preload
    useEffect(() => {
      if (isAboveFold && product.imageUrls?.[0]) {
        const img = new window.Image();
        img.src = product.imageUrls[0];
      }
    }, [isAboveFold, product.imageUrls]);
    
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

    // 이미지 URL 최적화 (CloudFront 직접 사용)
    const optimizedImageUrl = product.imageUrls?.[0];

    return (
      <article 
          className="group relative w-full max-w-[280px] h-[320px] sm:h-[300px] lg:h-[280px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 mx-auto isolate transform-gpu will-change-transform"
          onClick={handleCardClick}
          onKeyDown={handleKeyPress}
          role="button"
          tabIndex={0}
          aria-label={`${product.name} 상품 상세보기`}
        >
          {/* 상품 이미지 영역 - layout shift 방지를 위한 고정 크기 */}
          <div className="relative w-full h-[200px] sm:h-[180px] lg:h-[160px] min-h-[160px] overflow-hidden rounded-t-lg bg-gray-100 isolate transform-gpu">
            {optimizedImageUrl && !imageError ? (
              <Image
                src={optimizedImageUrl}
                alt={`${product.name} 상품 이미지`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu"
                priority={isAboveFold}
                loading={isAboveFold ? "eager" : "lazy"}
                fetchPriority={isAboveFold ? "high" : "auto"}
                onError={handleImageError}
                sizes="(max-width: 640px) 280px, (max-width: 768px) 280px, (max-width: 1024px) 280px, 280px"
                placeholder="empty"
                quality={75}
              />
            ) : (
              // 이미지 없음 또는 에러 상태
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 isolate">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">이미지 없음</span>
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
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