"use client";

import { useRouter } from "next/navigation";
import { ProductDetailProps } from "../model/model";
import { useProductDetail } from "../hooks/useProductDetail";
import Image from "next/image";
import { getBusinessDetail, BusinessDetail } from "@/shared/business/api";
import ReviewSection from "@/features/reviews/ui/ReviewsSection";
import { useEffect, useState } from "react";

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { product, isLoading, error, getBeeTypeKorean } = useProductDetail(productId);
  const [businessInfo, setBusinessInfo] = useState<BusinessDetail | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [imagePositions, setImagePositions] = useState([0, 1, 2, 3, 4]);

  // 뒤로 가기 버튼 처리
  const handleGoBack = () => {
    router.back();
  };

  // 업체 정보 로드
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (product?.businessId) {
        try {
          console.log("=== 업체 정보 로드 ===");
          console.log("상품 정보:", product);
          console.log("업체 정보 요청 - businessId:", product.businessId);
          
          setBusinessLoading(true);
          setBusinessError(null);
          
          const businessData = await getBusinessDetail(product.businessId);
          console.log("업체 정보 응답:", businessData);
          setBusinessInfo(businessData);
        } catch (error) {
          console.error("업체 정보 로드 실패:", error);
          setBusinessError("업체 정보를 불러올 수 없습니다.");
        } finally {
          setBusinessLoading(false);
        }
      } else {
        console.log("businessId가 없습니다.");
        setBusinessLoading(false);
        setBusinessError("업체 정보가 없습니다.");
      }
    };

    fetchBusinessInfo();
  }, [product?.businessId]);

  // 상품 정보 불러오는 중
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-lg">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 상품 정보 찾을 수 없을 때
  if (error || !product) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500">{error || "상품 정보를 찾을 수 없습니다."}</p>
        <button 
          onClick={handleGoBack} 
          className="mt-4 px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-16 items-stretch">
        {/* 이미지 섹션 */}
        <div className="flex gap-4">
          {/* 메인 이미지 */}
          <div className="flex-1 aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <Image
                src={product.imageUrls[imagePositions[0]]} 
                alt={`${product.name} 메인 이미지`}
                width={400}
                height={400}
                style={{ objectFit: 'cover' }}
                className="w-full h-full cursor-pointer"
                priority
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">상품 이미지가 없습니다</p>
              </div>
            )}
          </div>

          {/* 썸네일 그리드 2x2 */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="grid gap-2">
              {[1, 2, 3, 4].map((thumbnailIndex) => {
                const displayImageIndex = imagePositions[thumbnailIndex];
                const displayImageUrl = product.imageUrls[displayImageIndex];

                if (!displayImageUrl) {
                  return (
                    <div 
                      key={`empty-${thumbnailIndex}`}
                      className="aspect-square bg-gray-300 rounded-lg"
                    />
                  );
                }

                return (
                  <div 
                    key={thumbnailIndex} 
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 border-transparent opacity-70 hover:opacity-100"
                    onClick={() => {
                      // 교환 로직
                      const newPositions = [...imagePositions];
                      const currentMain = newPositions[0];
                      const clickedImage = newPositions[thumbnailIndex];
                      
                      // 메인과 클릭한 썸네일 교환
                      newPositions[0] = clickedImage;
                      newPositions[thumbnailIndex] = currentMain;
                      
                      setImagePositions(newPositions);
                    }}
                  >
                    <Image
                      src={displayImageUrl} 
                      alt={`${product.name} 썸네일 ${thumbnailIndex + 1}`}
                      width={76}
                      height={76}
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full"
                      loading="eager"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* 상품 정보 섹션 */}
        <div className="flex flex-col justify-between">
          {/* 상품 기본 정보 */}
          <div className="space-y-3 bg-[#FBFBFB] p-4 rounded-xl">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-20 text-gray-500">벌종류:</span>
                <span>{getBeeTypeKorean(product.beeType)}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">원산지:</span>
                <span>{product.origin || "정보 없음"}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">거래방법:</span>
                <span>{product.transactionMethod || "정보 없음"}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">거래형태:</span>
                <span>{product.transactionType || "정보 없음"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">가격:</span>
                <span className="font-bold text-xl">{product.price.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="border-1 border-[#E2E5EB] rounded-xl p-4 mt-4">
            <h3 className="font-bold mb-3">판매자 정보</h3>
            {businessLoading ? (
              <div className="text-sm text-gray-500">업체 정보를 불러오는 중...</div>
            ) : businessError ? (
              <div className="text-sm text-red-500">
                {businessError}
                <div className="text-xs text-gray-400 mt-1">
                  (업체 ID: {product.businessId})
                </div>
              </div>
            ) : businessInfo ? (
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-15 text-gray-500">업체명:</span>
                  <span>{businessInfo.companyName}</span>
                </div>
                <div className="flex">
                  <span className="w-15 text-gray-500">대표자:</span>
                  <span>{businessInfo.representativeName}</span>
                </div>
                <div className="flex">
                  <span className="w-15 text-gray-500">주소:</span>
                  <span>{businessInfo.businessAddress}</span>
                </div>
                <div className="flex">
                  <span className="w-15 text-gray-500">전화번호:</span>
                  <span>{businessInfo.phoneNumber}</span>
                </div>
                {businessInfo.onlineStoreUrl && (
                  <div className="flex">
                    <span className="w-20 text-gray-500">온라인스토어:</span>
                      <a 
                        href={businessInfo.onlineStoreUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        바로가기
                      </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                업체 정보가 없습니다.
                <div className="text-xs text-gray-400 mt-1">
                  업체 ID: {product.businessId}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 상품 상세 설명 */}
      <div className="mt-16 border-1 border-[#E2E5EB] rounded-xl p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold">상품 상세정보</h2>
          <div className="flex items-center gap-2">
            {businessInfo?.kakaoChatUrl && (
              <a 
                href={businessInfo.kakaoChatUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                문의하기
              </a>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="whitespace-pre-line text-gray-700">
            {product.content || "상세 정보가 없습니다."}
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <ReviewSection productId={productId} />
    </div>
  );
}