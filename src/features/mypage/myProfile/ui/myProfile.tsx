"use client";

import { useProfile } from "../model/hooks";
import { BusinessList } from "./myBusinessList";

export default function MyProfile() {
  const { realName, cropAddresses, loading, error, isClient } = useProfile();

  // 클라이언트 마운트 전에는 로딩 상태 표시
  if (!isClient || loading) {
    return (
      <div className="w-full text-xs flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="w-full text-xs flex flex-col justify-center items-center">
        <div className="text-red-500 text-center">
          <p className="font-semibold">오류 발생</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs flex flex-col w-full">
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full flex flex-row justify-between">
          <div className="">
            {realName || "사용자"}
            <span className="text-sm">님 반갑습니다</span>
          </div>
          <div>
            <a href="/myprofile" className="underline text-sm">
              프로필 수정
            </a>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex flex-col justify-start items-center w-[335px] mx-auto border border-gray-400 rounded-lg p-4 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]">
          {/* 나의 업체 정보 */}
          <div className="flex flex-col w-full">
            <div className="font-semibold text-sm text-main-800">
              나의 업체 정보
            </div>
            <BusinessList />
          </div>

          {/* 나의 농지 정보 */}
          <div className="flex flex-col gap-1 w-full">
            <div className="font-semibold text-sm text-main-800">
              나의 농지 정보
            </div>
            {cropAddresses.length > 0 ? (
              cropAddresses.map((address, index) => (
                <div
                  key={index}
                  className="text-base font-regular text-gray-700"
                >
                  농지명 <span className="text-gray-900 pl-4">{address}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-xs py-2">
                등록된 농지 정보가 없습니다.
              </div>
            )}
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
      </div>
    </div>
  );
}
