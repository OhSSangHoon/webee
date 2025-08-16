"use client";

import { useProfile } from "../model/hooks";
import { BusinessList } from "./myBusinessList";

export default function MyProfile() {
  const { realName, cropAddresses, loading, error, isClient } = useProfile();

  // 클라이언트 마운트 전에는 로딩 상태 표시
  if (!isClient || loading) {
    return (
      <div className="custom-box h-full w-full text-xs flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="custom-box h-full w-full text-xs flex flex-col justify-center items-center p-4">
        <div className="text-red-500 text-center">
          <p className="font-semibold">오류 발생</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box h-full text-xs flex flex-col justify-between items-start p-3 sm:p-4 gap-3 sm:gap-4 w-full">
      {/* 상단 컨텐츠 */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {/* 사용자 정보 헤더 */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex-1">
            <span className="font-bold text-lg sm:text-xl">
              {realName || "사용자"}
            </span>
            <span className="text-sm sm:text-base">님 반갑습니다</span>
          </div>
          <div>
            <a href="/myprofile" className="underline hover:text-black text-xs sm:text-sm">
              프로필 수정
            </a>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex flex-col justify-start items-center gap-3 sm:gap-4 w-full">
          {/* 나의 업체 정보 */}
          <div className="flex flex-col gap-2 w-full">
            <div className="font-medium text-sm">나의 업체 정보</div>
            <div className="flex flex-row gap-1 overflow-x-auto scrollbar-hide hover:scrollbar-show group">
              <BusinessList />
            </div>
          </div>

          {/* 나의 농지 정보 */}
          <div className="flex flex-col gap-2 w-full">
            <div className="font-medium text-sm">나의 농지 정보</div>
            <div className="flex flex-row gap-1 overflow-x-auto scrollbar-thin">
              {cropAddresses.length > 0 ? (
                cropAddresses.map((address, index) => (
                  <div key={index} className="custom-button whitespace-nowrap text-xs">
                    {address}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-xs py-2">
                  등록된 농지 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex w-full flex-col gap-3 mt-auto">
        <div className="w-full h-px bg-gray-200"></div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => (window.location.href = "/products")}
            className="w-full bg-[#1E40AF] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#1E3A8A] transition-colors font-medium text-xs sm:text-sm"
          >
            + 새 상품 등록하기
          </button>
          <button
            onClick={() => (window.location.href = "/myprofile")}
            className="w-full border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            업체 등록하기
          </button>
          <button
            onClick={() => (window.location.href = "/cropInfo")}
            className="w-full border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            작물정보 등록하기
          </button>
        </div>
      </div>
    </div>
  );
}