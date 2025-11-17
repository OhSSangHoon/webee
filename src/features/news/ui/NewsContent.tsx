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
          className="news-card bg-white/10 hover:bg-white/30 shadow-xl rounded-2xl p-5 border-[1.5] border-purple-300 cursor-pointer transition-colors"
        >
          <h3
            className="news-title text-base font-semibold text-neutral-300 text-shadow-2xs hover:text-purple-600 transition-colors "
            // contain-intrinsic-size 제거로 레이아웃 시프트 방지
          >
            {item.title}
          </h3>
          <div className="text-sm text-white/70" suppressHydrationWarning>
            🕒 {formatDateSimple(item.pubDate)}
          </div>
        </div>
      ))}
    </>
  );
});

NewsContent.displayName = "NewsContent";

export default NewsContent;
