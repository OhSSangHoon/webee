"use client";
import Image from "next/image";

export default function QuickProfile() {
  const realName = localStorage.getItem("realName");
  return (
    <div className="custom-box flex flex-col mt-10">
      <div className=" flex flex-row justify-start items-end pt-3 pb-7">
          <p className="text-2xl">{realName}</p>
          <p className="ml-1">님 반갑습니다.</p>
      </div>
      <div className=" flex flex-col">
        <div className="flex flex-row justify-between items-center mt-5 gap-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm">나의 프로필</div>
            <div className="w-20 h-20 bg-[#b8e6ff] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" className="w-8 h-8" width={32} height={32} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-sm">수정벌 추천</div>
            <div className="w-20 h-20 bg-[#fada7a] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" className="w-8 h-8" width={32} height={32} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-sm">진단 데이터</div>
            <div className="w-20 h-20 bg-[#d9cbff] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" className="w-8 h-8" width={32} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
