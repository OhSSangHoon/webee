"use client";
import Image from "next/image";

export default function QuickProfile() {
  const realName = localStorage.getItem("realName");
  return (
    <div className="custom-box  basis-[25%] h-60 flex flex-col  justify-around ">
      <div className=" flex flex-row justify-start items-end ml-5">
        <div className="text-2xl ">{realName}</div>님 반갑습니다.
      </div>

      {/*  <div className="custom-box basis-[30%]  h-60 flex flex-col justify-between items-center">
      <div className=" flex flex-row justify-start items-end">
        <div className="text-2xl">홍길동</div>님 반갑습니다.
      </div> */}
      <div className=" flex flex-col justify-around items-center ">
        <div className="flex flex-row justify-between items-center mt-5 gap-5 ">
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm">나의 프로필</div>
            <div className="w-20 h-20 bg-[#b8e6ff] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" width={32} height={32} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-sm">수정벌 추천</div>
            <div className="w-20 h-20 bg-[#fada7a] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" width={32} height={32} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-sm">진단 데이터</div>
            <div className="w-20 h-20 bg-[#d9cbff] rounded-md flex items-center justify-center">
              <Image src="/bee.svg" alt="bee" width={32} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
