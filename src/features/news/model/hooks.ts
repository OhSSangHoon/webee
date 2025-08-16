import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchGoogleNews } from "../api/newsApi";
import type { NewsHookReturn, NewsKeyword, NewsItem } from "./types";

const ITEMS_PER_PAGE = 10;

export const useNews = (initialData: NewsItem[] = []): NewsHookReturn => {
  const [news, setNews] = useState<NewsItem[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState<NewsKeyword>("꿀벌");

  const loadNews = useCallback(async (searchKeyword: NewsKeyword) => {
    setLoading(true);
    setError(null);
    
    try {
      const newsData = await fetchGoogleNews(searchKeyword);
      console.log(`뉴스 로드 완료 - 키워드: ${searchKeyword}, 개수: ${newsData.length}`);
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews(keyword);
  }, [keyword, loadNews]);

  // 초기 데이터 설정을 위한 별도 useEffect
  useEffect(() => {
    if (initialData.length > 0) {
      setNews(initialData);
    }
  }, [initialData]);

  const totalPages = useMemo(() => Math.ceil(news.length / ITEMS_PER_PAGE), [news.length]);
  
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return news.slice(start, end);
  }, [news, currentPage]);

  const handleSetKeyword = useCallback((newKeyword: NewsKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1); // 키워드 변경 시 즉시 첫 페이지로 초기화
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refresh = useCallback(() => {
    loadNews(keyword);
  }, [keyword, loadNews]);

  return {
    news,
    loading,
    error,
    currentPage,
    keyword,
    setKeyword: handleSetKeyword,
    setCurrentPage: handleSetCurrentPage,
    refresh,
    currentItems,
    totalPages,
  };
};