"use client";

import { useNews } from "../model/hooks";
import type { NewsItem } from "../model/types";
import NewsContent from "./NewsContent";

interface BeeNewsProps {
  initialData?: NewsItem[];
}

export default function BeeNews({ initialData = [] }: BeeNewsProps) {
  const {
    loading,
    error,
    keyword,
    currentItems,
    currentPage,
    totalPages,
    setKeyword,
    setCurrentPage,
    refresh,
  } = useNews(initialData);

  // 모바일 스켈레톤 카드
  const SkeletonCard = () => (
    <div className="bg-white/10 rounded-2xl p-4 border-[1.5] border-purple-300 animate-pulse w-full">
      <div className="h-5 bg-purple-200/30 rounded mb-2"></div>
      <div className="h-4 bg-purple-200/20 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-purple-200/20 rounded w-1/2"></div>
    </div>
  );

  const handleRouter = (link: string) => {
    if (typeof window !== "undefined") window.open(link, "_blank");
  };

  return (
    <div className="bg-gradient-to-b from-[#fffffff6] to-[#ffd675f6] pt-5  ">
      <main className=" mx-auto flex flex-col gap-4 px-3">
        {/* 뉴스 컨텐츠 */}
        <section className="w-full order-2">
          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : error ? (
              <div className="text-center">
                <div className="bg-red-100/20 border border-red-300 text-main-900 p-4 rounded-2xl">
                  <h2 className="text-lg font-bold mb-1">⚠️ 오류 발생</h2>
                  <p className="text-xs">{error}</p>
                  <button
                    onClick={refresh}
                    className="mt-2 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-xs"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <h2 className="text-lg font-bold text-main-900 mb-1">
                    📰 뉴스가 없습니다
                  </h2>
                  <p className="text-main-900 text-xs">
                    다른 키워드로 검색해보세요.
                  </p>
                </div>
              </div>
            ) : (
              <NewsContent items={currentItems} onItemClick={handleRouter} />
            )}
          </div>
        </section>

        {/* 사이드바 */}
        <section className="w-full order-1">
          <h2 className="text-2xl font-extrabold text-main-900  drop-shadow">
            {keyword} 소식을 들고왔어요!
          </h2>
          <h3 className="text-gray-800  text-base  mt-1">
            {keyword} 관련 국내외 최신 뉴스를 확인하세요. 양봉, 생태, 정책, 기술
            동향까지 빠르게 전달드립니다.
          </h3>

          {/* 주제 버튼 */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setKeyword("꿀벌")}
              disabled={loading}
              className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                keyword === "꿀벌"
                  ? "bg-main-800 text-white"
                  : "bg-white text-main-900  hover:bg-main-800 "
              }`}
            >
              꿀벌 뉴스
            </button>
            <button
              onClick={() => setKeyword("수정벌")}
              disabled={loading}
              className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                keyword === "수정벌"
                  ? "bg-main-800 text-white"
                  : "bg-white text-main-900  hover:bg-main-800"
              }`}
            >
              수정벌 뉴스
            </button>
          </div>

          {/* 페이지네이션 */}
          {!loading && !error && currentItems.length > 0 && totalPages > 1 && (
            <div className="py-4 flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className="px-3 py-1 text-main-900 text-xs font-semibold rounded-full shadow-md disabled:opacity-40
               bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/90 transition-all"
              >
                ← 이전
              </button>

              <span
                className="px-3 py-1 text-main-900 text-xs font-semibold rounded-full shadow-md
                  bg-white/20 backdrop-blur-sm border border-white/30"
              >
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                className="px-3 py-1 text-main-900 text-xs font-semibold rounded-full shadow-md disabled:opacity-40
               bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                다음 →
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
