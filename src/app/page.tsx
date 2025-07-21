"use client";

import { Weather2 } from "@/features";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = (link?: string) => {
    if (!link) return;
    router.push(link);
  };

  return (
    <div className="relative">
      {/* 랜딩 섹션 */}
      <section className="relative h-full bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden pt-20">
        <main className="relative z-10 pt-20 pb-20">
          <div className="container mx-auto px-5 text-center">
            <section className="mb-16">
              <h1 className="text-6xl md:text-7xl font-black text-white mb-5 leading-tight">
                농업인들의 든든한 파트너
                <br />
                <span className="text-yellow-300">webee</span>와 함께
              </h1>
              <p className="text-xl text-gray-100 mb-10 opacity-90">
                수정벌과 관련된 모든 정보! 거래부터 관리까지 제공합니다.
              </p>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl shadow-yellow-400/30">
                지금 시작하기
              </button>
            </section>

            {/* 날씨 위젯 */}
            <section className="max-w-6xl mx-auto relative">
              <Weather2 />
              <h2 className="text-white/50 absolute text-sm mt-1 px-1 text-center">
              날씨 정보를 보려면 <span className="underline underline-offset-4">내 위치 확인</span>을 허용해 주세요.
              </h2>
            </section>
          </div>
        </main>

        {/* 기능 섹션 */}
        <article id="features" className="py-20 bg-white/5">
          <div className="container mx-auto px-5">
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                webee의 특별한 기능들
              </h2>
              <p className="text-xl text-gray-300">
                농업을 더 스마트하게 활용하는 방법
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: "🩺",
                  title: "수정벌 진단 기능",
                  description:
                    "AI 기반 이미지 분석으로 수정벌의 건강 상태와 질병을 정확하게 진단해드립니다 ↗",
                  link: "/diagnosis",
                },
                {
                  icon: "🌾",
                  title: "농작물 맞춤 수정벌 추천",
                  description:
                    "재배하시는 농작물의 특성에 맞는 최적의 수정벌 품종을 추천해드립니다 ↗",
                  link: "/recommend",
                },
                {
                  icon: "🫱🏻‍🫲🏻",
                  title: "수정벌 거래 연결",
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
                  title: "맞춤 농약 찾기",
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
              ].map((feature) => (
                <article
                  onClick={() => handleClick(feature.link)}
                  key={feature.title}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 text-center ">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed opacity-90 text-center">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
