import { ProductDetail } from "@/features";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}) {
  const { productId: productIdParam } = await params;
  const productId = parseInt(productIdParam, 10);
  
  // 잘못된 productId 처리
  if (isNaN(productId)) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">잘못된 상품 ID입니다.</p>
      </div>
    );
  }
  
  return <ProductDetail productId={productId} />;
}