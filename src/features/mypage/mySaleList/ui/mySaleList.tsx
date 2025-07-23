'use client';

import { useState, useEffect } from 'react';
import { getProductsByBusiness } from '@/features/search/api/api';
import { ProductWithBusiness } from '@/features/search/model/model';
import { useBusinessStore } from '@/shared/business/model';
import { useUserStore } from '@/shared/auth/useUserStore';
import Image from 'next/image';

export default function MySaleList() {
  const [myProducts, setMyProducts] = useState<ProductWithBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { list: businessList, fetchList: fetchBusinessList } = useBusinessStore();
  const { isLoggedIn } = useUserStore();

  // 내가 등록한 상품 목록 조회 (모든 소유 업체의 상품)
  useEffect(() => {
    const fetchMyProducts = async () => {
      // 로그인 상태가 아니면 실행하지 않음
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // 먼저 업체 목록을 가져옴
        await fetchBusinessList();
        
      } catch (err) {
        console.error('업체 목록 조회 실패:', err);
        setError('업체 정보를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    fetchMyProducts();
  }, [isLoggedIn, fetchBusinessList]);

  // 업체 목록이 로드된 후 각 업체의 상품을 조회
  useEffect(() => {
    const fetchProductsFromBusinesses = async () => {
      if (businessList.length === 0) {
        setMyProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        // 각 업체별로 상품을 조회하고 병합
        const allProductPromises = businessList.map(business => 
          getProductsByBusiness(business.businessId)
        );

        const responses = await Promise.allSettled(allProductPromises);
        
        const allProducts: ProductWithBusiness[] = [];
        responses.forEach((response) => {
          if (response.status === 'fulfilled') {
            allProducts.push(...(response.value.data?.content || []));
          }
        });

        setMyProducts(allProducts);
      } catch (err) {
        console.error('내 상품 목록 조회 실패:', err);
        setError('상품 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsFromBusinesses();
  }, [businessList]);

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="custom-box2 w-full h-full flex flex-col justify-center items-center pb-10">
        <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-500">상품 목록을 불러오는 중...</div>
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
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (myProducts.length === 0) {
    return (
      <div className="custom-box2 w-full h-full flex flex-col justify-center items-center pb-10">
        <div className="custom-box2-title mb-4">내가 등록한 상품 목록</div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-500">등록한 상품이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box2 w-full flex flex-col justify-center items-center">
      <div className="custom-box2-title">내가 등록한 상품 목록</div>
      <div className="flex flex-row justify-between items-center w-full h-full px-10 py-4 gap-2 ">
        {myProducts.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="w-1/4 h-[200px] rounded-md border border-gray-300 flex flex-col"
          >
            {/* 상품 이미지 */}
            <div className="h-1/2 rounded-t-md overflow-hidden">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-[#E5E7EB] h-full w-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">이미지 없음</span>
                </div>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="h-1/2 w-full bg-white p-4 rounded-b-md flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-1 truncate" title={product.name}>
                  {product.name}
                </div>
                <div className="text-[#615FFF] text-sm font-medium">
                  {formatPrice(product.price)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {product.beeType} • {product.origin}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}