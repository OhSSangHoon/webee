// 벌 종류
export type BeeType = 'HONEYBEE' | 'ASIAN_BUMBLEBEE' | 'EUROPEAN_BUMBLEBEE' | 'MASON_BEE';

// 상품 등록 요청 데이터
export interface productData {
    name: string;
    beeType: BeeType;
    price: number;
    content: string;
}

// 상품 데이터
export interface product {
    id: number;
    name: string;
    beeType: string;
    price: number;
    sellerId: number;
    content: string;
    imageUrls: string[];
}


// 상품 목록 응답 
export interface productResponse {
    code: string;
    message: string;
    data: {
        content: product[];
        page?: {
            size: number;
            number: number;
            totalElements: number;
            totalPages: number;
        };
    };
}

// 상품 상세
export interface productDetailResponse {
    code: string;
    message: string;
    data: product;
}


// 상품 상세 페이지
export interface ProductDetailProps {
    productId: number;
}