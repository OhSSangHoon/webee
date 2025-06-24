"use client"

import React, { useState, useEffect } from 'react';
import { Weather2 } from "@/features";
import { DiagnosisBanner, QuickProfile } from "@/widgets";
import QuickMenu from "@/widgets/home/quickMenu/ui/quickMenu";

export default function Home() {
  const [currentTemp, setCurrentTemp] = useState('25°C');
  
  useEffect(() => {
    // 온도 애니메이션
    const temps = ['25°C', '26°C', '24°C', '25°C'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % temps.length;
      setCurrentTemp(temps[index]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      {/* 랜딩 섹션 */}
      <section className="relative h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 overflow-hidden pt-20">
        <main className="relative z-10 pt-20 pb-20">
          <div className="container mx-auto px-5 text-center">
            <section className="mb-16">
              <h1 className="text-6xl md:text-7xl font-black text-white mb-5 leading-tight">
                양봉인들의 든든한 파트너<br />
                <span className="text-yellow-300">webee</span>와 함께
              </h1>
              <p className="text-xl text-gray-100 mb-10 opacity-90">
                정확하고 직관적인 날씨 정보로 당신의 하루를 계획하세요
              </p>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl shadow-yellow-400/30">
                지금 시작하기
              </button>
            </section>

            {/* 날씨 위젯 */}
            <section className="max-w-4xl mx-auto">
              <article className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                  <div className="text-6xl md:text-7xl font-light text-white transition-all duration-500">
                    {currentTemp}
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl text-white mb-2">경산시, 경북</h2>
                    <p className="text-lg text-gray-200 opacity-80">맑음</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                  {[
                    { day: '오늘', temp: '25°' },
                    { day: '내일', temp: '28°' },
                    { day: '목요일', temp: '24°' },
                    { day: '금요일', temp: '26°' },
                    { day: '토요일', temp: '23°' }
                  ].map((forecast, index) => (
                    <div 
                      key={forecast.day}
                      className="bg-white/10 rounded-2xl p-5 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-white/20"
                    >
                      <h3 className="text-white font-semibold mb-3">{forecast.day}</h3>
                      <p className="text-2xl text-yellow-300 font-bold">{forecast.temp}</p>
                    </div>
                  ))}
                </div>
              </article>
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
                날씨 정보를 더 스마트하게 활용하는 방법
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: '🔍',
                  title: '꿀벌 진단 기능',
                  description: 'AI 기반 이미지 분석으로 꿀벌의 건강 상태와 질병을 정확하게 진단해드립니다'
                },
                {
                  icon: '🌾',
                  title: '농작물 맞춤 수정벌 추천',
                  description: '재배하시는 농작물의 특성에 맞는 최적의 수정벌 품종을 추천해드립니다'
                },
                {
                  icon: '🤝',
                  title: '수정벌 거래 연결',
                  description: '신뢰할 수 있는 양봉장들과 직접 연결하여 안전한 수정벌 거래를 지원합니다'
                },
                {
                  icon: '📊',
                  title: '양봉장 관리 시스템',
                  description: '벌통 상태, 꿀 생산량, 관리 일정 등을 체계적으로 관리할 수 있습니다'
                },
                {
                  icon: '🌡️',
                  title: '양봉 특화 날씨 정보',
                  description: '꿀벌 활동에 최적화된 기상 정보와 양봉 작업 가이드를 제공합니다'
                },
                {
                  icon: '👨‍🌾',
                  title: '전문가 상담 서비스',
                  description: '경험 많은 양봉 전문가들과의 실시간 상담으로 문제를 해결해드립니다'
                }
              ].map((feature, index) => (
                <article 
                  key={feature.title}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl group"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 text-center">
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
    <div className="flex flex-col gap-4 max-w-screen-xl mx-auto px-4">
      <div className="flex flex-row gap-4">
        <Weather2 /> <QuickProfile />
      </div>

      <div className="flex flex-row gap-4">
        <QuickMenu />
        <DiagnosisBanner />
      </div>
    </div>
  );
}