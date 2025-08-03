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
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoading(false);
    }, []);

    return (
      <div className="w-[235px] h-[90%] rounded-md border border-gray-300 flex flex-col hover:shadow-md transition-all duration-300 group">
        {/* 상품 이미지 */}
        <div className="h-2/3 rounded-t-md overflow-hidden relative">
          {product.imageUrls && product.imageUrls.length > 0 && !imageError ? (
            <>
              {/* 로딩 스켈레톤 */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                width={200}
                height={100}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg"
              />
            </>
          ) : (
            <div className="bg-[#E5E7EB] h-full w-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div
          className="h-1/2 w-full bg-white p-4 rounded-b-md flex flex-col justify-between cursor-pointer hover:bg-[#F8FAFF] transition-colors group-hover:shadow-sm"
          onClick={() => {
            router.push(`/products/${product.id}`);
          }}
          role="button"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          <div className="flex flex-col">
            <div
              className="text-sm font-semibold mb-1 truncate group-hover:text-blue-600 transition-colors"
              title={product.name}
            >
              {product.name}
            </div>
            <div className="text-[#615FFF] text-sm font-medium">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getBeeTypeKorean(product.beeType)} • {product.origin}
            </div>
          </div>

          {/* 새 탭 아이콘 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";
