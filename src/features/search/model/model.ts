import { product } from '@/features/products/model/model';

// 업체 정보를 포함한 상품 타입
export interface ProductWithBusiness extends product {
  businessAddress?: string;
  companyName?: string;
}

// 검색 상태 타입
export interface SearchState {
  searchTerm: string;
  filteredProducts: ProductWithBusiness[];
  allProducts: ProductWithBusiness[];
  loading: boolean;
}

// 사이드바 상태 타입
export interface SidebarState {
  isOpen: boolean;
  selectedBusinessId: number | null;
  selectedProductName: string;
  selectedProductId: number | null;
}