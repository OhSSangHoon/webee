import api from "@/shared/auth/lib";
import { productResponse } from "@/features/products/model/model";

// 전체 상품 조회
export async function getAllProducts() {
    const response = await api.get<productResponse>('/products');
    return response.data;
}

// 업체별 상품 조회
export async function getProductsByBusiness(businessId: number) {
    const response = await api.get<productResponse>(`/products?businessId=${businessId}`);
    return response.data;
}

// 벌 종류별 상품 조회
export async function getProductsByBeeType(beeType: string) {
    const response = await api.get<productResponse>(`/products?bee=${beeType}`);
    return response.data;
}

// 페이징과 함께 상품 조회
export async function getProductsWithPaging(params: {
    page?: number;
    size?: number;
    businessId?: number;
    bee?: string;
    sort?: string;
}) {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.businessId) searchParams.append('businessId', params.businessId.toString());
    if (params.bee) searchParams.append('bee', params.bee);
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await api.get<productResponse>(`/products?${searchParams.toString()}`);
    return response.data;
}