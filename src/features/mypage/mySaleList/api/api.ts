import { getProductsByBusiness } from '@/features/search/api/api';
import { ProductWithBusiness } from '@/features/search/model/model';

export const fetchMyProducts = async (businessIds: number[]): Promise<ProductWithBusiness[]> => {
  try {
    const allProductPromises = businessIds.map(id => getProductsByBusiness(id));
    const responses = await Promise.allSettled(allProductPromises);
    
    const allProducts: ProductWithBusiness[] = [];
    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        allProducts.push(...(response.value.data?.content || []));
      }
    });

    return allProducts;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록을 불러오는 중 오류가 발생했습니다.');
  }
};
