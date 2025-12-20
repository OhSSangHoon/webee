"use client";

import { Weather } from "@/features";
import { useRouter } from "next/navigation";
import { NewsCarousel } from "@/widgets/home/newsCarousel/ui/NewsCarousel";

const FEATURES_DATA = [
  {
    icon: "🩺",
    title: "수정벌 진단",
    description:
      "AI 기반 이미지 분석으로 수정벌의 건강 상태와 질병을 정확하게 진단해드립니다 ↗",
    link: "/diagnosis",
  },
  {
    icon: "🌾",
    title: "수정벌 추천",
    description:
      "재배하시는 농작물의 특성에 맞는 최적의 수정벌 품종을 추천해드립니다 ↗",
    link: "/recommend",
  },
  {
    icon: "🫱🏻‍🫲🏻",
    title: "거래 연결",
    description:
      "신뢰할 수 있는 양봉장들과 직접 연결하여 안전한 수정벌 거래를 지원합니다 ↗",
    link: "/search",
  },
  {
    icon: "📺",
    title: "수정벌 소식",
    description:
      "벌에 관한 모든 소식, 생태 환경, 정책 변화, 기술 동향을 확인할 수 있습니다. ↗",
    link: "news",
  },
  {
    icon: "🔍",
    title: "맞춤 농약",
    description:
      "수정벌에 따른 농약 사용 궁금하신 분들을 위해 맞춤 농약 추천 서비스를 제공합니다 ↗",
    link: "/pesticide",
  },
  {
    icon: "🤖",
    title: "챗봇 기능",
    description:
      "수정벌 관련 궁금한 점들을 24시간 언제든지 AI챗봇과 대화로 해결하세요",
  },
];

export default function Home() {
  const router = useRouter();

  const handleClick = (link?: string) => {
    if (!link) return;
    router.push(link);
  };

  return (
    <div className="flex flex-col items-center w-[335px] mx-auto pb-4">
      {/* 날씨 위젯 */}
      <Weather />
      {/* 기능 섹션 */}
      <article id="features" className="w-full">
        <div className="w-full h-full my-4">
          <h3 className="text-xl font-bold text-main-900 font-bold">Webee의 특별한 기능을 누려보세요!</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {FEATURES_DATA.map((feature) => (
            <article
              onClick={() => handleClick(feature.link)}
              key={feature.title}
              className=""
            >
              <div className="w-25 h-25 bg-main-500 rounded-xl flex flex-col items-center justify-center cursor-pointer group">
                <div className="text-3xl py-2 transition-all duration-200 group-hover:scale-105">{feature.icon}</div>
                <h4 className="text-md font-medium text-gray-900 transition-all duration-200 group-hover:text-lg">{feature.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </article>
      {/* 뉴스 섹션 */}
      <article id="news" className="mt-2 gap-4 w-full">
        <div className="w-full h-full my-4">
          <h3 className="text-xl font-bold text-main-900 font-bold">오늘의 주요 뉴스를 확인하세요!</h3>
        </div>
        <NewsCarousel />
      </article>
    </div>
  );
}
