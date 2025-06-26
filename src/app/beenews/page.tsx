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

  // ✅ CORS 우회 프록시 주소 변경 (corsproxy.io)
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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGoogleNews("꿀벌").then(setNews).catch(console.error);
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentItems = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className=" bg-gradient-to-br from-indigo-400 via-purple-400 to-purple-400 overflow-hidden pt-20 ">
      <main className=" py-5 flex flex-col lg:flex-row lg:mr-60 gap-6 items-start justify-center">
        <section className="w-full lg:w-1/5 lg:translate-x-[-50px]">
          <h2 className=" text-4xl font-extrabold  text-white drop-shadow">
            꿀벌 소식을 들고왔어요!
          </h2>
          <h3>
            꿀벌에 관한 국내외 최신 뉴스를 한눈에 확인하세요. 양봉과 생태 환경,
            정책 변화, 기술 동향까지 꿀벌과 관련된 실시간 이슈를 빠르게
            전달해드립니다.
          </h3>
        </section>
        <section className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 hover:bg-white/30 transition-all shadow-xl rounded-2xl p-6 border-[1.5] border-purple-300"
              >
                <h3 className="text-xl font-bold text-purple-800 hover:text-purple-600 transition-colors mb-3">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <div className="text-sm text-white/70 mb-4">
                  🕒 {new Date(item.pubDate).toLocaleString("ko-KR")}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 mb-10 flex justify-center items-center space-x-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-5 py-2 border-2 border-purple-300 hover:bg-white/20 text-white font-semibold rounded-full shadow disabled:opacity-40"
            >
              ← 이전
            </button>
            <span className="px-4 py-2 text-white font-semibold bg-purple-500 rounded-full shadow ">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-5 py-2  border-2 border-purple-300 hover:bg-white/20 text-white font-semibold rounded-full shadow disabled:opacity-40"
            >
              다음 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
