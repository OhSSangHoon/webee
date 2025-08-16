"use client";

import { memo, useState, useEffect } from "react";
import type { NewsItem } from "../model/types";

// 하이드레이션 안전한 날짜 포맷터
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // UTC 기준으로 일관된 포맷팅
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

interface NewsContentProps {
  items: NewsItem[];
  onItemClick: (link: string) => void;
}

const NewsContent = memo(({ items, onItemClick }: NewsContentProps) => {
  const [isClient, setIsClient] = useState(false);

  // hydration 완료 후에만 동적 내용 렌더링
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {items.map((item, index) => (
        <div
          onClick={() => onItemClick(item.link)}
          key={`news-${index}-${item.link?.slice(-10) || index}`} // 더 안전한 키 생성
          className="news-card bg-white/10 hover:bg-white/30 shadow-xl rounded-2xl p-6 border-[1.5] border-purple-300 cursor-pointer"
        >
          <h3 
            className="news-title text-xl font-bold text-purple-800 hover:text-purple-600 transition-colors mb-3" 
            style={{ containIntrinsicSize: "auto 3rem" }}
          >
            {item.title}
          </h3>
          <div className="text-sm text-white/70 mb-4">
            🕒 {isClient ? formatDate(item.pubDate) : item.pubDate}
          </div>
        </div>
      ))}
    </>
  );
});

NewsContent.displayName = "NewsContent";

export default NewsContent;