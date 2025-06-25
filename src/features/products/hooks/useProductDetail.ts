import { useState, useEffect } from "react";
import { getProductDetail } from "../api/api";
import { product } from "../model/model";

// 상품 상세 훅
export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 상세 정보 조회
  useEffect(() => {
    async function fetchProductDetail() {
      try {
        setIsLoading(true);
        const response = await getProductDetail(productId);
        setProduct(response.data);
      } catch (err) {
        console.error("상품 상세 정보 조회 오류:", err);
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductDetail();
  }, [productId]);

  return {
    product,
    isLoading,
    error,
  };
}
