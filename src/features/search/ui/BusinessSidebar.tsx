'use client';

import { useState, useEffect } from 'react';
import { BusinessDetail } from '@/shared/business/api';
import { getProductsWithPaging } from '../api/api';
import { ProductWithBusiness } from '@/features/search/model/model';
import { getBeeTypeKorean } from '@/shared/types/beeSwitch';

/**
 * 업체 상품 목록 조회
 * @param isOpen 사이드바 열림 여부
 * @param onClose 사이드바 닫기 함수
 * @param businessInfo 업체 정보
 * @param isLoading 업체 정보 로딩 여부
 * @param error 업체 정보 조회 오류
 * @param productName 선택된 상품 이름
 * @param productId 선택된 상품 ID
 * @param selectedBusinessId 선택된 업체 ID
 */
interface BusinessSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: BusinessDetail | null;
  isLoading: boolean;
  error: string | null;
  productName: string;
  productId: number | null;
  selectedBusinessId: number | null;
}

export function BusinessSidebar({ 
  isOpen, 
  onClose, 
  businessInfo, 
  isLoading, 
  error, 
  productName, 
  productId,
  selectedBusinessId 
}: BusinessSidebarProps) {
  const [businessProducts, setBusinessProducts] = useState<ProductWithBusiness[]>([]); // 업체 상품 목록
  const [productsLoading, setProductsLoading] = useState(false); // 업체 상품 로딩 여부

  // 업체 상품 조회
  useEffect(() => {
    const fetchBusinessProducts = async () => {
      const businessId = selectedBusinessId;
      
      if (!businessId || !isOpen) return;
      
      setProductsLoading(true);
      try {
        const response = await getProductsWithPaging({
          businessId: businessId,
          page: 0,
          size: 20
        });
        setBusinessProducts(response.data?.content || []);
      } catch (error) {
        console.error('업체 상품 조회 실패:', error);
        setBusinessProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchBusinessProducts();
  }, [selectedBusinessId, isOpen]);

  const handleProductDetailClick = (selectedProductId: number) => {
    window.location.href = `/products/${selectedProductId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };


  return (
    <>
      {/* 사이드바 */}
      <div className={`fixed left-[20%] h-[calc(100vh-80px)] w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6">
              <h2 className="font-medium text-lg">{productName || '상품 이름'}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full  cursor-pointer"
              aria-label="사이드바 닫기"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">업체 정보를 불러오는 중...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 px-6">
                <p className="text-red-500 mb-2">{error}</p>
                <button 
                  onClick={onClose}
                  className="text-blue-500 hover:underline  cursor-pointer"
                >
                  닫기
                </button>
              </div>
            ) : businessInfo ? (
              <div className="p-6 space-y-6">
                {/* 기본 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800">기본 정보</h3>
                  <div className="space-y-3 flex flex-row gap-4">
                    <div>
                      <p className="text-sm text-gray-500">업체명</p>
                      <p className="font-medium">{businessInfo.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">대표자</p>
                      <p className="font-medium">{businessInfo.representativeName}</p>
                    </div>
                  </div>
                </div>

                {/* 전체 상품 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800">전체 상품 ({businessProducts.length})</h3>
                  
                  {productsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">상품을 불러오는 중...</p>
                      </div>
                    </div>
                  ) : businessProducts.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">등록된 상품이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-120 overflow-y-auto scrollbar-hide">
                      {businessProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-white hover:shadow-sm ${
                            product.id === productId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                          }`}
                          onClick={() => handleProductDetailClick(product.id)}
                        >
                          <div className="flex justify-between items-start mb-2 min-h-[24px]">
                            <h4 className="font-medium text-gray-900 text-sm flex-1">
                              {product.name.length > 15 ? `${product.name.substring(0, 15)}...` : product.name}
                            </h4>
                            <div className="w-20 flex justify-end">
                              {product.id === productId && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded whitespace-nowrap">
                                  현재 상품
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-semibold text-green-600">
                              {formatPrice(product.price)}
                            </p>
                            <p>
                              <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                                {getBeeTypeKorean(product.beeType)}
                              </span>
                            </p>
                            <div className="flex justify-between items-center text-xs">
                              <span>{product.origin}</span>
                              <span className="text-blue-600">상세보기 →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-6">
                <p className="text-gray-500">업체 정보를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}