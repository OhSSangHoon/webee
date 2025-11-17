"use client";

import Image from "next/image";
import Link from "next/link";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { product } from "@/features/products/model/model";
import { ShoppingCart } from "lucide-react";

// -----------------------------
// Skeleton Product Card
// -----------------------------
const SkeletonProductCard: React.FC = () => (
  <div className="rounded-xl p-4 bg-white animate-pulse">
    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 w-20 mb-2 rounded" />
    <div className="h-5 bg-gray-200 w-3/4 mb-1 rounded" />
    <div className="h-3 bg-gray-200 w-2/3 mb-4 rounded" />
    <div className="h-5 bg-gray-200 w-16 rounded" />
  </div>
);

// -----------------------------
// Product Card
// -----------------------------
const ProductCard: React.FC<{ product: product }> = ({ product }) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ko-KR").format(price);

  return (
    <Link
      href={`/products/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className=" cursor-pointer rounded-lg p-1 hover:shadow transition">
        {product.imageUrls?.[0] && (
          <div className="w-full aspect-square relative mb-4">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover rounded-lg bg-gray-100"
            />
          </div>
        )}

        {/* 벌 타입 */}
        <span className="inline-block bg-main-400 text-main-900 px-2 py-1 rounded-md text-xs font-semibold mb-1 w-fit">
          {getBeeTypeKorean(product.beeType)}
        </span>

        {/* 상품명 */}
        <h4 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] mb-1">
          {product.name}
        </h4>

        {/* 가격 */}
        <div className="text-lg font-bold text-sub-900">
          {formatPrice(product.price)}원
        </div>
      </div>
    </Link>
  );
};

// -----------------------------
// Products Section
// -----------------------------
interface ProductsSectionProps {
  products: product[];
  loading: boolean;
  beeType: string;
}

export function ProductsSection({
  products,
  loading,
  beeType,
}: ProductsSectionProps) {
  if (loading) {
    return (
      <div className="mt-4 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-4 h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="text-gray-500">
            <p className="font-medium">{beeType}과 관련된 상품이 없습니다</p>
            <p className="text-sm text-gray-400">다른 벌 종류도 확인해보세요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-y-auto">
      <div className="mb-4 font-semibold text-xl">
        총 <span className="text-sub-900">{products.length}</span>개의 {beeType}{" "}
        추천 상품
      </div>
      <div className="grid grid-cols-2 gap-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
