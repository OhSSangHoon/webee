"use client";

import { useNews } from "../model/hooks";
import type { NewsItem } from "../model/types";
import NewsContent from "./NewsContent";

interface BeeNewsProps {
  initialData?: NewsItem[];
}

export default function BeeNews({ initialData = [] }: BeeNewsProps) {
  const { loading, error, keyword, currentItems, currentPage, totalPages, setKeyword, setCurrentPage, refresh } = useNews(initialData);

  // 스켈레톤 컴포넌트 - 메모이제이션으로 리렌더링 방지
  const SkeletonCard = () => (
    <div className="bg-white/10 rounded-2xl p-6 border-[1.5] border-purple-300 animate-pulse">
      <div className="h-6 bg-purple-200/30 rounded mb-3"></div>
      <div className="h-4 bg-purple-200/20 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-purple-200/20 rounded w-1/2"></div>
    </div>
  );

  const handleRouter = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] pt-40 pb-20 w-full min-h-screen">
      <main className="max-w-[75%] mx-auto gap-6 flex lg:flex-row flex-col">
        {/* 뉴스 컨텐츠를 우선 표시 */}
        <section className="w-full lg:w-3/4 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {loading ? (
              // 로딩 스켈레톤
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`loading-skeleton-${index}`} />
              ))
            ) : error ? (
              // 에러 상태
              <div className="col-span-full text-center">
                <div className="bg-red-100/20 border border-red-300 text-white p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-2">⚠️ 오류 발생</h2>
                  <p>{error}</p>
                  <button 
                    onClick={refresh}
                    className="mt-4 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : currentItems.length === 0 ? (
              // 빈 상태
              <div className="col-span-full text-center">
                <div className="bg-white/10 p-6 rounded-2xl">
                  <h2 className="text-xl font-bold text-white mb-2">📰 뉴스가 없습니다</h2>
                  <p className="text-white/70">다른 키워드로 검색해보세요.</p>
                </div>
              </div>
            ) : (
              // 뉴스 리스트 - 즉시 렌더링
              <NewsContent items={currentItems} onItemClick={handleRouter} />
            )}
          </div>
        </section>

        {/* 사이드바 */}
        <section className="w-full lg:w-2/4 lg:order-1">
          <h2 className="text-4xl font-extrabold text-white drop-shadow">
            {keyword} 소식을 들고왔어요!
          </h2>
          <h3 className="text-white text-sm mt-2">
            {keyword}에 관한 국내외 최신 뉴스를 한눈에 확인하세요. 양봉과 생태
            환경, 정책 변화, 기술 동향까지 관련 이슈를 빠르게 전달해드립니다.
          </h3>

          {/* 주제 선택 버튼 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setKeyword("꿀벌")}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 ${
                keyword === "꿀벌"
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-500/80 text-white hover:bg-indigo-600/90"
              }`}
            >
              꿀벌 뉴스
            </button>
            <button
              onClick={() => setKeyword("수정벌")}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 ${
                keyword === "수정벌"
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-500/80 text-white hover:bg-indigo-600/90"
              }`}
            >
              수정벌 뉴스
            </button>
          </div>

          {!loading && !error && currentItems.length > 0 && totalPages > 1 && (
            <div className="py-10 flex items-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className="px-5 py-2 border-2 border-white/40 hover:bg-white/25 text-white font-semibold rounded-full shadow disabled:opacity-40 transition-colors"
              >
                ← 이전
              </button>
              <span className="w-22 text-center px-4 py-2 text-white font-semibold bg-indigo-600/90 rounded-full shadow">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                className="px-5 py-2 border-2 border-white/40 hover:bg-white/25 text-white font-semibold rounded-full shadow disabled:opacity-40 transition-colors"
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