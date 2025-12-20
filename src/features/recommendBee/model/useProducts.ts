import { useState } from "react";
import { product } from "@/features/products/model/model";
import { filterProductsByBeeType } from "@/shared/types/beeSwitch";
import { getProducts } from "@/features/products/api/api";
import { useRecommendBee } from "./useRecommendation";

export function useProducts() {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // 중복 호출 방지
  const { resultData } = useRecommendBee();

  const loadProducts = async () => {
    if (loaded) return; // 이미 불러왔으면 다시 호출 X

    setLoading(true);
    try {
      const response = await getProducts();
      const filtered = filterProductsByBeeType(
        response.data.content,
        resultData.beeType
      );
      setProducts(filtered);
    } catch (err) {
      console.error("상품 로딩 실패:", err);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  return { products, loading, loadProducts };
}
