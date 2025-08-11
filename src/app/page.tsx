"use client";

import { Weather2 } from "@/features";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [showBee, setShowBee] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBee(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (link?: string) => {
    if (!link) return;
    router.push(link);
  };

  const handleStart = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    router.push(token ? "/recommend" : "/signIn");
  };

  return (
    <>
      <Head>
        <link rel="canonical" href="https://webee-ten.vercel.app/" />
        <meta name="description" content="수정벌과 관련된 모든 정보! AI 질병진단, 맞춤 수정벌 추천, 거래 연결, 농약 정보까지 농업인의 든든한 파트너 webee와 함께하세요." />
      </Head>
      <div className="relative">
      {/* 떠다니는 벌 효과 */}
      {showBee && (
      <div className="fixed inset-0 z-9 pointer-events-none">
        <div className="bee fly-1" style={{ top: "10%", right: "20%" }}>
          <div className="relative w-12 h-12">
            <Image
              src="/bee.webp"
              alt=""
              width={48}
              height={48}
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          </div>
        </div>
        <div className="bee fly-2" style={{ top: "40%", left: "20%" }}>
          <div className="relative w-12 h-12">
            <Image
              src="/bee.webp"
              alt=""
              width={48}
              height={48}
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          </div>
        </div>
        <div className="bee fly-3" style={{ top: "30%", right: "30%" }}>
          <div className="relative w-8 h-8">
            <Image
              src="/bee.webp"
              alt=""
              width={32}
              height={32}
              className="object-cover"
              loading="lazy"
              quality={80}
            />
            </div>
          </div>
        </div>
      )}

      {/* 랜딩 섹션 */}
      <section className="relative h-full bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden pt-30">
        <main className="relative z-10 pb-20">
          <div className="container mx-auto px-5 text-center">
            <section className="mb-15">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight flex flex-col items-center justify-center" style={{contain: 'layout style', contentVisibility: 'auto'}}>
                <span>농업인의 든든한 파트너</span>
                <span><span className="text-yellow-300">webee</span>와 함께</span>
              </h1>
              <p className="text-xl text-gray-100 mb-6 opacity-90 min-h-[3rem] flex items-center justify-center">
                수정벌과 관련된 모든 정보! 거래부터 관리까지 제공합니다.
              </p>
              <button
                className="bg-yellow-400  text-gray-800 px-10 py-5 rounded-full text-lg font-bold hover_start_button "
                onClick={handleStart}
              >
                지금 시작하기
              </button>
            </section>
            {/* 날씨 위젯 */}
            <section className="max-w-6xl mx-auto relative">
              <Weather2 />
              <h2 className="text-white/50 absolute text-sm mt-1 px-1 text-center">
                날씨 정보를 보려면{" "}
                <span className="underline underline-offset-4">
                  내 위치 확인
                </span>
                을 허용해 주세요.
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
    </>
  );
}
