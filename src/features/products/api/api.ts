import api from "@/shared/auth/lib";
import { productData, productResponse, productDetailResponse } from "../model/model";


// 상품 등록 API
export async function createProduct(productRequest: productData, imageFiles: File[]) {
    // 폼 데이터 생성
    const formData = new FormData();

    formData.append('request', new Blob([JSON.stringify(productRequest)], {type: 'application/json'}));

    // 이미지 첨부
    imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
    });

    // 상품 등록 API 호출
    const response = await api.post('products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

    return response.data;
}


// 상품 목록 조회 API
export async function getProducts() {
    const response = await api.get<productResponse>('/products');
    return response.data;
}

// 상품 상세 조회 API
export async function getProductDetail(productId: number) {
    const response = await api.get<productDetailResponse>(`/products/${productId}`);
    return response.data;
}

