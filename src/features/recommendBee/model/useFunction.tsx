/* 추천 결과 페이지 전용 컴포넌트 모음
   - Section: 아이콘 + 제목 + 리스트 형태의 섹션 UI
   - ProductsSection: 추천된 상품 목록 로딩/빈 상태/리스트 렌더링
*/

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getBeeTypeKorean } from "@/shared/types/beeSwitch";
import { product } from "@/features/products/model/model";

export function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="card-title ">{title}</h4>
      </div>
      <ul className=" list-disc card-content ">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProductsSection({
  products,
  loading,
  beeType,
}: {
  products: product[];
  loading: boolean;
  beeType: string;
}) {
  if (loading) {
    return (
      <div className="mt-4 h-[400px] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600"></div>
          상품을 불러오는 중...
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
    <div className="mt-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100">
      <div className="space-y-4 pr-2">
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
          <ShoppingCart className="w-4 h-4" />
          {beeType} 관련 상품 {products.length}개
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white cursor-pointer">
        <div className="flex gap-4">
          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className="flex-shrink-0">
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                width={80}
                height={80}
              />
            </div>
          )}

          <div className="flex-grow space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-gray-800 line-clamp-2">
                {product.name}
              </h4>
              <span className="text-lg font-bold text-indigo-600 flex-shrink-0">
                {formatPrice(product.price)}원
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                  {getBeeTypeKorean(product.beeType)}
                </span>
                <span>원산지: {product.origin}</span>
              </div>

              <div className="text-sm text-gray-500">
                거래형태: {product.transactionType} | 거래방법:{" "}
                {product.transactionMethod}
              </div>
            </div>

            {product.content && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
