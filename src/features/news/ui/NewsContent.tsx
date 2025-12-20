"use client";

import { memo } from "react";
import type { NewsItem } from "../model/types";

// SSR 안전한 간단한 날짜 포맷터
const formatDateSimple = (dateString: string): string => {
  try {
    // 간단한 날짜 파싱으로 성능 향상
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // 로케일 기반 포맷팅으로 SSR/CSR 일관성 확보
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

interface NewsContentProps {
  items: NewsItem[];
  onItemClick: (link: string) => void;
}

const NewsContent = memo(({ items, onItemClick }: NewsContentProps) => {
  return (
    <>
      {items.map((item, index) => (
        <div
          onClick={() => onItemClick(item.link)}
          key={`news-${index}-${item.title.slice(0, 10)}`} // 더 빠른 키 생성
          className=" max-w-[355px] p-6 rounded-2xl
      bg-[#6f4f1c]/10 backdrop-blur-[18px] border-2 border-white/30
      shadow-inner shadow-[#70930597]/10 drop-shadow-lg flex flex-col gap-4
      overflow-hidden"
        >
          <h3
            className="news-title text-base  text-gray-800 text-shadow-2xs hover:text-main-900 transition-colors "
            // contain-intrinsic-size 제거로 레이아웃 시프트 방지
          >
            {item.title}
          </h3>
          <div className="text-sm text-main-800" suppressHydrationWarning>
            🕒 {formatDateSimple(item.pubDate)}
          </div>
        </div>
      ))}
    </>
  );
});

NewsContent.displayName = "NewsContent";

export default NewsContent;
