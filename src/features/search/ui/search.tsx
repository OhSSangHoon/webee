'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/features/products/api/api'; // 상품 데이터 가져오기
import { product } from '@/features/products/model/model';

export default function search() {
  const [products, setProducts] = useState<product[]>([]); // 상품 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.content);
      } catch (error) {
        console.error('상품 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if(loading){
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {/* 검색 영역 */}
      <div className="w-[20%] h-[calc(100vh-80px)] flex flex-col items-start border-r border-[#E5E7EB]">
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
              className="w-full h-10 border-2 border-[#E5E7EB] rounded-md text-[#333333] pl-10"
              placeholder="수정벌 또는 양봉업체 검색"
            />
            <button 
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              검색
            </button>
          </div>
        </div>
        
        {/* 검색 결과 리스트 */}
        {products.map(product => (
          <div key={product.id} className="w-full h-[100px] border-b border-[#EEF2FF] flex flex-row justify-between px-5">
            <div className="flex flex-col justify-center">
              <p className="text-[#333333] font-medium text-lg">
                {product.name.length > 12 ? product.name.slice(0,12) + '···' : product.name}
              </p>
              <div className="flex flex-row items-center mt-2">
                <img src="/Location.svg" alt="location" className="w-4 h-4 rounded-full"/>
                {/* 판매자 위치 */}
                <p className="text-[#6B7280] text-xs">경상북도 경산시 압량읍</p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-end">
              <p className="text-[#6B7280] font-medium text-lg">&gt;</p>
              <div className="flex flex-row items-center mt-2">
                {/* 리뷰 개수 */}
                <p className="text-[#333333] text-xs font-medium">리뷰 100개</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 판매자의 판매목록 */}
      {/* 지도 영역 */}
      <div className="w-[80%] h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-blue-500">
        <p>map</p>
      </div>
    </div>
  );
}