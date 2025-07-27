import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductWithBusiness } from '@/features/search/model/model';
import { useBusinessStore } from '@/shared/business/model';
import { useUserStore } from '@/shared/auth/useUserStore';
import { fetchMyProducts } from '../api/api';

export interface SlideInfo {
  canGoPrev: boolean;
  canGoNext: boolean;
  totalSlides: number;
  currentSlide: number;
}

export const useMySaleList = () => {
  const [myProducts, setMyProducts] = useState<ProductWithBusiness[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const { list: businessList, fetchList: fetchBusinessList } = useBusinessStore();
  const { isLoggedIn } = useUserStore();

  // 슬라이드 네비게이션
  const goNext = useCallback(() => {
    setCurrentIndex(prev => 
      prev < myProducts.length - 4 ? prev + 1 : prev
    );
  }, [myProducts.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  // 현재 보이는 상품들
  const visibleProducts = useMemo(() => {
    return myProducts.slice(currentIndex, currentIndex + 4);
  }, [myProducts, currentIndex]);

  // 슬라이드 정보
  const slideInfo: SlideInfo = useMemo(() => ({
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < myProducts.length - 4,
    totalSlides: Math.max(1, Math.ceil(myProducts.length / 4)),
    currentSlide: Math.floor(currentIndex / 4)
  }), [currentIndex, myProducts.length]);

  // 데이터 페칭
  useEffect(() => {
    const loadProducts = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await fetchBusinessList();
        setHasInitialized(true);
      } catch (err) {
        console.error('업체 목록 조회 실패:', err);
        setError('업체 정보를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    loadProducts();
  }, [isLoggedIn, fetchBusinessList]);

  // 업체별 상품 조회
  useEffect(() => {
    const loadProductsFromBusinesses = async () => {
      if (!hasInitialized) return;
      
      if (businessList.length === 0) {
        setMyProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const businessIds = businessList.map(b => b.businessId);
        const products = await fetchMyProducts(businessIds);
        
        setMyProducts(products);
        setCurrentIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductsFromBusinesses();
  }, [businessList, hasInitialized]);

  return {
    myProducts,
    visibleProducts,
    slideInfo,
    isLoading,
    error,
    actions: {
      goNext,
      goPrev,
      retry: () => window.location.reload()
    }
  };
};