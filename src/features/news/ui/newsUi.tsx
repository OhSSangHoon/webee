"use client";
import { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
};

const fetchGoogleNews = async (query: string): Promise<NewsItem[]> => {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=ko&gl=KR&ceid=KR:ko`;

  const res = await fetch(`https://corsproxy.io/?${rssUrl}`);
  const xmlText = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = xml.querySelectorAll("item");

  const newsList: NewsItem[] = [];

  items.forEach((item) => {
    const title = item.querySelector("title")?.textContent || "";
    const link = item.querySelector("link")?.textContent || "";
    const pubDate = item.querySelector("pubDate")?.textContent || "";
    const description = item.querySelector("description")?.textContent || "";
    newsList.push({ title, link, pubDate, description });
  });

  return newsList;
};

export default function BeeNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("꿀벌"); // 현재 검색어 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchGoogleNews(keyword)
      .then(setNews)
      .catch((err) => {
        console.error(err);
        setError("뉴스를 불러오는데 실패했습니다.");
      })
      .finally(() => setLoading(false));
    setCurrentPage(1); //  키워드 바뀌면 첫 페이지로 초기화
  }, [keyword]);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentItems = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRouter = (link: string) => {
    window.open(link, "_blank"); // 새 탭에서 링크 열기
  };

  // 스켈레톤 컴포넌트
  const SkeletonCard = () => (
    <div className="bg-white/10 rounded-2xl p-6 border-[1.5] border-purple-300 animate-pulse">
      <div className="h-6 bg-purple-200/30 rounded mb-3"></div>
      <div className="h-4 bg-purple-200/20 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-purple-200/20 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className=" bg-gradient-to-br from-indigo-400 via-purple-400 to-purple-400 overflow-hidden pt-20 h-lvh">
      <main className=" py-5 flex flex-col lg:flex-row lg:mr-60 gap-6 items-start justify-center">
        <section className="w-full lg:w-1/5 lg:translate-x-[-50px]">
          <h2 className=" text-4xl font-extrabold  text-white drop-shadow">
            {keyword} 소식을 들고왔어요!
          </h2>
          <h3 className="text-white text-sm mt-2">
            {keyword}에 관한 국내외 최신 뉴스를 한눈에 확인하세요. 양봉과 생태
            환경, 정책 변화, 기술 동향까지 관련 이슈를 빠르게 전달해드립니다.
          </h3>

          {/* ✅ 주제 선택 버튼 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setKeyword("꿀벌")}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                keyword === "꿀벌"
                  ? "bg-white text-purple-700"
                  : "bg-purple-300 text-white"
              }`}
            >
              꿀벌 뉴스
            </button>
            <button
              onClick={() => setKeyword("수정벌")}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                keyword === "수정벌"
                  ? "bg-white text-purple-700"
                  : "bg-purple-300 text-white"
              }`}
            >
              수정벌 뉴스
            </button>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {loading ? (
              // 로딩 스켈레톤
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : error ? (
              // 에러 상태
              <div className="col-span-full text-center">
                <div className="bg-red-100/20 border border-red-300 text-white p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-2">⚠️ 오류 발생</h3>
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
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
                  <h3 className="text-xl font-bold text-white mb-2">📰 뉴스가 없습니다</h3>
                  <p className="text-white/70">다른 키워드로 검색해보세요.</p>
                </div>
              </div>
            ) : (
              // 뉴스 리스트
              currentItems.map((item, index) => (
                <div
                  onClick={() => handleRouter(item.link)}
                  key={index}
                  className="bg-white/10 hover:bg-white/30 transition-all shadow-xl rounded-2xl p-6 border-[1.5] border-purple-300 cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-purple-800 hover:text-purple-600 transition-colors mb-3">
                    <a target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <div className="text-sm text-white/70 mb-4">
                    🕒 {new Date(item.pubDate).toLocaleString("ko-KR")}
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && !error && currentItems.length > 0 && (
            <div className="mt-5 mb-10 flex justify-center items-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-5 py-2 border-2 border-purple-300 hover:bg-white/20 text-white font-semibold rounded-full shadow disabled:opacity-40 transition-colors"
              >
                ← 이전
              </button>
              <span className="px-4 py-2 text-white font-semibold bg-purple-500 rounded-full shadow">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-5 py-2 border-2 border-purple-300 hover:bg-white/20 text-white font-semibold rounded-full shadow disabled:opacity-40 transition-colors"
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
