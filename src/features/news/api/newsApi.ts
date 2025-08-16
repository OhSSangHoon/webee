import type { NewsItem } from "../model/types";

const parseXMLtoResults = (xmlText: string): NewsItem[] => {
  const newsList: NewsItem[] = [];
  
  // 서버/클라이언트 호환 XML 파싱
  try {
    // <item> 태그들을 정규식으로 추출
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const items = xmlText.match(itemRegex) || [];
    
    items.forEach((itemXml) => {
      const title = extractContent(itemXml, 'title') || "";
      const link = extractContent(itemXml, 'link') || "";
      const pubDate = extractContent(itemXml, 'pubDate') || "";
      const description = extractContent(itemXml, 'description') || "";
      
      if (title && link) {
        newsList.push({ title, link, pubDate, description });
      }
    });
  } catch (error) {
    console.error('XML parsing error:', error);
  }

  return newsList;
};

// XML 태그에서 내용 추출하는 헬퍼 함수
const extractContent = (xml: string, tag: string): string => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim() : "";
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
      // 우선순위 높은 요청으로 처리
      priority: 'high',
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