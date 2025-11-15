"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { fetchGoogleNews } from "@/features/news/api/newsApi";
import type { NewsItem } from "@/features/news/model/types";
import "swiper/css";

export const NewsCarousel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGoogleNews("수정벌");
        // 최대 5개의 뉴스만 가져오기
        setNews(data.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "뉴스를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleNewsClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="w-full h-[110px] flex items-center justify-center bg-gradient-to-r from-main-400/20 to-main-500/20 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-main-700 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-main-700">뉴스 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[110px] flex items-center justify-center bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
        <span className="text-sm text-red-600">{error}</span>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full h-[110px] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
        <span className="text-sm text-gray-600">뉴스가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="w-full relative mb-8">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={12}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={500}
        className="h-[110px]"
      >
        {news.map((item, index) => (
          <SwiperSlide key={`${item.link}-${index}`} className="!w-[280px]">
            <div
              onClick={() => handleNewsClick(item.link)}
              className="w-full h-full border-1 border-gray-400 rounded-xl p-4 cursor-pointer flex flex-col justify-between"
            >
              {/* 뉴스 제목 */}
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-3 leading-relaxed">
                  {item.title}
                </h4>
              </div>

              {/* 하단 정보 */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                <span className="text-xs text-gray-700">
                  {new Date(item.pubDate).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-gray-700 font-medium">
                  자세히 보기 →
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
