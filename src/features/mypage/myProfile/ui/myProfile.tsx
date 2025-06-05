"use client";

import { BusinessList } from "./myBusinessList";

export default function MyProfile() {
  const realName = localStorage.getItem("realName");

  return (
    <div className="custom-box h-full max-w-90 min-w-10 text-xs flex flex-col justify-around items-start p-4 gap-4">
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <span className="font-bold text-xl">{realName}</span>님 반갑습니다
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

        {/* 나의 농지 정보 */}
        <div className="flex flex-col gap-2 w-full">
          <div>나의 농지 정보</div>
          <div className="flex flex-row gap-1 overflow-x-auto scrollbar-thin">
            <div className="custom-button whitespace-nowrap">경북 고령군</div>
            <div className="custom-button whitespace-nowrap">경북 예천군</div>
            <div className="custom-button whitespace-nowrap">제주시 애월읍</div>
          </div>
        </div>
      </div>
    </div>
  );
}
