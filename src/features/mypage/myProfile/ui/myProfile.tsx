"use client";

import { useProfile } from "../model/hooks";
import { BusinessList } from "./myBusinessList";

/**
 * 마이프로필 메인 컴포넌트
 * 사용자 정보, 업체 정보, 농지 정보를 표시합니다.
 */
export default function MyProfile() {
  const { realName, cropAddresses, loading, error, isClient } = useProfile();

  // 클라이언트 마운트 전에는 로딩 상태 표시
  if (!isClient || loading) {
    return (
      <div className="custom-box h-full max-w-90 min-w-10 text-xs flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="custom-box h-full max-w-90 min-w-10 text-xs flex flex-col justify-center items-center p-4">
        <div className="text-red-500 text-center">
          <p className="font-semibold">오류 발생</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-box h-full max-w-90 min-w-10 text-xs flex flex-col justify-around items-start p-4 gap-4">
      {/* 사용자 정보 헤더 */}
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <span className="font-bold text-xl">{realName || "사용자"}</span>님
          반갑습니다
        </div>
        <div>
          <a href="/myprofile" className="underline hover:text-black">
            프로필 수정
          </a>
        </div>
      </div>

      <div className="flex flex-col justify-around items-center gap-5 w-full">
        {/* 나의 업체 정보 */}
        <div className="flex flex-col gap-2 w-full">
          <div>나의 업체 정보</div>
          <div className="flex flex-row gap-1 overflow-x-auto scrollbar-hide hover:scrollbar-show group">
            <BusinessList />
          </div>
        </div>

        {/* 나의 농지 정보 - 동적 데이터 */}
        <div className="flex flex-col gap-2 w-full">
          <div>나의 농지 정보</div>
          <div className="flex flex-row gap-1 overflow-x-auto scrollbar-thin">
            {cropAddresses.length > 0 ? (
              cropAddresses.map((address, index) => (
                <div key={index} className="custom-button whitespace-nowrap">
                  {address}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm py-2">
                등록된 농지 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}