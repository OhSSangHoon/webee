import type { NewsItem } from "../model/types";

const parseXMLtoResults = (xmlText: string): NewsItem[] => {
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

// 캐시를 위한 Map
const newsCache = new Map<string, { data: NewsItem[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

export const fetchGoogleNews = async (query: string): Promise<NewsItem[]> => {
  // 캐시 확인
  const cached = newsCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=ko&gl=KR&ceid=KR:ko`;

  try {
    const res = await fetch(`https://corsproxy.io/?${rssUrl}`, {
      // 브라우저 캐싱 활용
      cache: 'force-cache',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const xmlText = await res.text();
    const newsList = parseXMLtoResults(xmlText);
    
    // 캐시에 저장
    newsCache.set(query, { data: newsList, timestamp: Date.now() });
    
    return newsList;
  } catch (error) {
    console.error('News fetch error:', error);
    throw new Error('뉴스를 불러오는데 실패했습니다.');
  }
};