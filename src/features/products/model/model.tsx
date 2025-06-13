// 벌 종류
export type BeeType = 'HONEYBEE' | 'ASIAN_BUMBLEBEE' | 'EUROPEAN_BUMBLEBEE' | 'MASON_BEE';

/**
 * 상품 등록 요청 데이터
 * @param name 상품명
 * @param beeType 벌 종류
 * @param price 가격
 * @param content 상품 설명
 * @param origin 원산지
 * @param transactionType 거래 형태
 * @param transactionMethod 거래 방법
 * @param businessId 업체 ID
 */
export interface productData {
    name: string;
    beeType: BeeType;
    price: number;
    content: string;
    origin: string;
    transactionType: string;
    transactionMethod: string;
    businessId: number;
}

/**
 * 상품 데이터
 * @param id 상품 ID
 * @param name 상품명
 * @param beeType 벌 종류
 * @param price 가격
 * @param businessId 업체 ID
 * @param content 상품 설명
 * @param imageUrls 이미지 URL 배열
 * @param origin 원산지
 * @param transactionType 거래 형태
 * @param transactionMethod 거래 방법
 * @param sellerId 판매자 ID
 */
export interface product {
    id: number;
    name: string;
    beeType: string;
    price: number;
    businessId: number;
    content: string;
    imageUrls: string[];
    origin: string;
    transactionType: string;
    transactionMethod: string;
    sellerId?: number;
}

/**
 * 상품 목록 응답 데이터
 * @param code 응답 코드
 * @param message 응답 메시지
 * @param data 상품 목록 데이터
 */
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

/**
 * 상품 상세 응답 데이터
 * @param code 응답 코드
 * @param message 응답 메시지
 * @param data 상품 데이터
 */
export interface productDetailResponse {
    code: string;
    message: string;
    data: product;
}

/**
 * 상품 상세 페이지 프롭스
 * @param productId 상품 ID
 */
export interface ProductDetailProps {
    productId: number;
}