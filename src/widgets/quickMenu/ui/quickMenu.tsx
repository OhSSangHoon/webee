"use client";

import { useInView } from "react-intersection-observer";

export default function QuickMenu() {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });

  const baseClass =
    "rounded-xl flex flex-col items-start justify-start gap-20 p-10 h-full basis-[32%] transition-all duration-300 transform hover:scale-102 hover:brightness-105 cursor-pointer";

  return (
    <div className="w-full h-60 flex flex-row items-center justify-between text-sm text-white">
      <div
        ref={ref1}
        className={`${baseClass} bg-gradient-to-br from-[#d3a1f8] to-[#b776ed]`}
        style={{
          transform: inView1 ? "translateY(0)" : "translateY(20px)",
          opacity: inView1 ? 1 : 0,
        }}
      >
        <div className="text-3xl font-semibold">업체검색</div>
        <div>수정벌을 판매하는 업체들을 찾아볼 수 있어요</div>
      </div>

      <div
        ref={ref2}
        className={`${baseClass} bg-gradient-to-br from-[#c0a4f9] to-[#9c70f0]`}
        style={{
          transform: inView2 ? "translateY(0)" : "translateY(20px)",
          opacity: inView2 ? 1 : 0,
        }}
      >
        <div className="text-3xl font-semibold">벌통 설치 추천</div>
        <div>사용자 농지 기반 벌통 설치 최적 장소를 추천해 드려요</div>
      </div>

      <div
        ref={ref3}
        className={`${baseClass} bg-gradient-to-br from-[#a8a7fc] to-[#7775f5]`}
        style={{
          transform: inView3 ? "translateY(0)" : "translateY(20px)",
          opacity: inView3 ? 1 : 0,
        }}
      >
        <div className="text-3xl font-semibold">수정벌 가이드</div>
        <div>ai와 사용자 맞춤 정보를 접목해 최적의 가이드를 제공해 드려요</div>
      </div>
    </div>
  );
}
