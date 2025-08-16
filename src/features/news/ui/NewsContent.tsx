"use client";

import { memo } from "react";
import type { NewsItem } from "../model/types";

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
          key={`${item.link}-${index}`}
          className="news-card bg-white/10 hover:bg-white/30 shadow-xl rounded-2xl p-6 border-[1.5] border-purple-300 cursor-pointer"
        >
          <h3 
            className="news-title text-xl font-bold text-purple-800 hover:text-purple-600 transition-colors mb-3" 
            style={{ containIntrinsicSize: "auto 3rem" }}
          >
            {item.title}
          </h3>
          <div className="text-sm text-white/70 mb-4">
            🕒 {new Date(item.pubDate).toLocaleString("ko-KR")}
          </div>
        </div>
      ))}
    </>
  );
});

NewsContent.displayName = "NewsContent";

export default NewsContent;