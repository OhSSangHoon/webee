"use client";

import dynamic from "next/dynamic";

const CropAddForm = dynamic(
  () => import("@/features/recommendBee/ui/cropAddForm"),
  { ssr: false }
);
const ResultBox = dynamic(
  () => import("@/features/recommendBee/ui/recommendBeeResult"),
  { ssr: false }
);

export default function RecommendBee() {
  return (
    <div className=" min-h-screen mx-auto gap-10 py-10 lg:w-[65%]">
      <div className="card-section-2 mt-20 text-[#333333] ">
        <header className="flex flex-col items-start justify-center bg-[#EEF2FF] px-6 py-6 rounded-t-lg">
          <h1 className="text-[18px] font-semibold">수정벌 추천</h1>
          <h3 className="text-[14px] text-[#6B7280]">
           농작물 정보를 알려주시면, 공공데이터를 바탕으로 적합한 수정벌을 추천해드릴게요!
          </h3>
        </header>

        <title>수정벌 추천</title>
        <div className="flex flex-row justify-center items-center">
          <CropAddForm />
          <ResultBox />
        </div>
      </div>
    </div>
  );
}
