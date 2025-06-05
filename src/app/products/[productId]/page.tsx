import { ProductDetail } from "@/features";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ productId: number }> 
}) {
  const { productId } = await params;
  
  return (
    <ProductDetail productId={productId} />
  );
}