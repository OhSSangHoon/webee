'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/features/products/api/api';
import { getBusinessDetail } from '@/shared/business/api';
import { product } from '@/features/products/model/model';
import { BusinessSidebar } from './BusinessSidebar';
import { getAllProducts } from '../api/api';
import { ProductWithBusiness } from '@/features/search/model/model';

export default function Search() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<ProductWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductWithBusiness[]>([]);
  
  // 사이드바 관련 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // 업체 정보 상태
  const [businessInfo, setBusinessInfo] = useState<any>(null);
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
      } catch (error) {
        console.error('업체 정보 조회 실패:', error);
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
        const response = await getProducts();
        console.log('상품 데이터:', response.data.content);
        
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
            } catch (error) {
              console.error(`업체 정보 조회 실패 (businessId: ${product.businessId}):`, error);
              return product; // 업체 정보 조회 실패 시 원본 상품 정보만 반환
            }
          })
        );

        // Promise.allSettled 결과에서 성공한 것들만 추출
        const successfulProducts = productsWithBusiness
          .filter((result): result is PromiseFulfilledResult<ProductWithBusiness> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        setAllProducts(successfulProducts);
        setFilteredProducts(successfulProducts);
      } catch (error) {
        console.error('상품 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithBusinessInfo();
  }, []);

  // 검색 기능
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.companyName && product.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.businessAddress && product.businessAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  // 상품 클릭 시 사이드바 열기
  const handleProductClick = (product: ProductWithBusiness) => {
    console.log('상품 클릭:', product.name, 'businessId:', product.businessId);
    setSelectedBusinessId(product.businessId);
    setSelectedProductName(product.name);
    setSelectedProductId(product.id);
    setSidebarOpen(true);
  };

  // 사이드바 닫기
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedBusinessId(null);
    setSelectedProductName('');
    setSelectedProductId(null);
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
    <div className="flex flex-row relative">
      {/* 검색 영역 */}
      <div className="w-[20%] h-[calc(100vh-80px)] flex flex-col items-start border-r border-[#E5E7EB] relative z-20 bg-white">
        {/* 검색 입력 */}
        <div className="w-full flex flex-col">
          <div className="relative my-10 px-10">
            <div className="absolute inset-y-0 left-10 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="text" 
              className="w-full h-10 border-2 border-[#E5E7EB] rounded-md text-[#333333] pl-10 pr-16"
              placeholder="상품명, 업체명, 주소 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              검색
            </button>
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
                className="w-full min-h-[110px] border-b border-[#EEF2FF] flex flex-col justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
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
                    <img src="/Location.svg" alt="location" className="w-3 h-3 mr-1"/>
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
      <div className="w-[80%] h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-blue-500">
        <p className="text-white text-2xl">지도 영역</p>
        <p className="text-white text-sm mt-2">
          왼쪽 상품 리스트를 클릭하면 업체 정보 사이드바가 나타납니다
        </p>
        <p className="text-white text-xs mt-1">
          각 상품의 실제 업체 주소가 표시됩니다
        </p>
      </div>

      {/* 업체 정보 사이드바 */}
      <BusinessSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        businessInfo={businessInfo}
        isLoading={businessLoading}
        error={businessError}
        productName={selectedProductName}
        productId={selectedProductId}
        selectedBusinessId={selectedBusinessId}
      />
    </div>
  );
}