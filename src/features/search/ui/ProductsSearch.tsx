'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAllProducts } from '@/features/search/api/api';
import { BusinessDetail, getBusinessDetail } from '@/shared/business/api';
import { product } from '@/features/products/model/model';
import { BusinessSidebar } from './BusinessSidebar';
import { ProductWithBusiness } from '@/features/search/model/model';
import dynamic from 'next/dynamic';

// 업체 정보 타입 정의
interface BusinessInfo {
  businessId: number;
  companyName: string;
  businessAddress: string;
  phoneNumber?: string;
  businessType?: string;
  description?: string;
  registrationNumber?: string;
  representativeName?: string;
  commencementDate?: string;
  latitude?: number;
  longitude?: number;
}

const Maps = dynamic(() => import('./Map').then(mod => ({ default: mod.Maps })), { ssr: false });

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<ProductWithBusiness[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithBusiness[]>([]);
  const [selectedBeeType, setSelectedBeeType] = useState<string | null>(null);
  
  // 사이드바 관련 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // 선택된 물품 전체 정보 저장
  const [selectedProduct, setSelectedProduct] = useState<ProductWithBusiness | null>(null);

  // 업체 정보 상태
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessError, setBusinessError] = useState<string | null>(null);

  // 선택된 업체 정보 조회
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!selectedBusinessId) {
        setBusinessInfo(null);
        return;
      }

      setBusinessLoading(true);
      setBusinessError(null);
      
      try {
        const info = await getBusinessDetail(selectedBusinessId);
        setBusinessInfo(info);
      } catch (fetchError) {
        console.error('업체 정보 조회 실패:', fetchError);
        setBusinessError('업체 정보를 불러올 수 없습니다.');
        setBusinessInfo(null);
      } finally {
        setBusinessLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [selectedBusinessId]);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchProductsWithBusinessInfo = async () => {
      try {
        const response = await getAllProducts();
        
        // 각 상품의 업체 정보를 병렬로 조회
        const productsWithBusiness = await Promise.allSettled(
          response.data.content.map(async (product: product) => {
            try {
              if (product.businessId) {
                const businessInfo = await getBusinessDetail(product.businessId);
                return {
                  ...product,
                  businessAddress: businessInfo.businessAddress,
                  companyName: businessInfo.companyName
                };
              }
              return product;
            } catch (productError) {
              console.error(`업체 정보 조회 실패 (businessId: ${product.businessId}):`, productError);
              return product;
            }
          })
        );

        const successfulProducts = productsWithBusiness
          .filter((result): result is PromiseFulfilledResult<ProductWithBusiness> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        setAllProducts(successfulProducts);
        setFilteredProducts(successfulProducts);
      } catch (generalError) {
        console.error('상품 데이터 가져오기 실패:', generalError);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithBusinessInfo();
  }, []);

  // 벌 타입 필터링
  useEffect(() => {
    if (selectedBeeType === null) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(product => product.beeType === selectedBeeType));
    }
  }, [selectedBeeType, allProducts]);

  // 벌 타입 필터 핸들러
  const handleBeeTypeFilter = (beeType: string | null) => {
    setSelectedBeeType(beeType);
  };

  // 벌 타입 라벨 변환
  const getBeeTypeLabel = (beeType: string) => {
    const types: { [key: string]: string } = {
      'HONEYBEE': '꿀벌',
      'BUMBLEBEE': '뒤영벌',
      'MASON_BEE': '머리뿔가위벌'
    };
    return types[beeType] || beeType;
  };

  // 상품 클릭 시 즉시 지도 이동을 위한 데이터 설정
  const handleProductClick = (product: ProductWithBusiness) => {
    // 선택된 물품 정보 저장
    setSelectedProduct(product);
    
    // 기존 사이드바 관련 상태들
    setSelectedBusinessId(product.businessId);
    setSelectedProductName(product.name);
    setSelectedProductId(product.id);
    setSidebarOpen(true);
  };

  // 지도 마커 클릭 핸들러
  const handleMarkerClick = (product: ProductWithBusiness) => {
    handleProductClick(product);
  };

  // 사이드바 닫기 시 선택된 물품도 초기화
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedBusinessId(null);
    setSelectedProductName('');
    setSelectedProductId(null);
    setSelectedProduct(null);
    setBusinessInfo(null);
    setBusinessError(null);
  };

  // 주소 축약 함수
  const getShortAddress = (address?: string) => {
    if (!address) return '주소 정보 없음';
    
    const parts = address.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ${parts[2]}`;
    }
    return address.length > 15 ? address.slice(0, 15) + '···' : address;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">상품 정보를 불러오는 중...</p>
          <p className="text-sm text-gray-500 mt-2">업체 정보도 함께 조회하고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row relative pt-20">
      {/* 검색 영역 */}
      <div className="w-[20%] h-[calc(100vh-80px)] flex flex-col items-start border-r border-[#E5E7EB] relative z-20 bg-white">
        {/* 벌 타입 필터 버튼 */}
        <div className="w-full p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">벌 종류별 필터</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleBeeTypeFilter(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedBeeType === null 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
            {['HONEYBEE', 'BUMBLEBEE', 'MASON_BEE'].map((beeType) => (
              <button
                key={beeType}
                onClick={() => handleBeeTypeFilter(beeType)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedBeeType === beeType 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {getBeeTypeLabel(beeType)}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 리스트 */}
        <div className="w-full flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-10">
              <p className="text-gray-500">검색된 상품이 없습니다.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`w-full min-h-[110px] border-b border-[#EEF2FF] flex flex-col justify-between px-5 py-3 cursor-pointer transition-colors ${
                  selectedProductId === product.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleProductClick(product)}
              >
                <div className="flex flex-row justify-between items-center flex-1">
                  <p className="text-[#333333] font-medium text-base leading-tight mb-1">
                    {product.name.length > 15 ? product.name.slice(0,15) + '···' : product.name}
                  </p>
                  <p className="text-[#6B7280] font-medium text-lg">&gt;</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center">
                    {/* img 태그를 Next.js Image로 변경 */}
                    <Image 
                      src="/Location.svg" 
                      alt="location" 
                      width={12}
                      height={12}
                      className="mr-1"
                    />
                    <p className="text-[#6B7280] text-xs">
                      {getShortAddress(product.businessAddress)}
                    </p>
                  </div>
                  <p className="text-[#6B7280] text-xs">
                    업체정보
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 지도 영역 */}
      <div className="w-[80%] h-[calc(100vh-80px)]">
        <Maps
          products={filteredProducts}
          selectedProductId={selectedProductId}
          selectedProduct={selectedProduct}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* 업체 정보 사이드바 */}
      <BusinessSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        businessInfo={businessInfo as BusinessDetail | null}
        isLoading={businessLoading}
        error={businessError}
        productName={selectedProductName}
        productId={selectedProductId}
        selectedBusinessId={selectedBusinessId}
      />
    </div>
  );
}