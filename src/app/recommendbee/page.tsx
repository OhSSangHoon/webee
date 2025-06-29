import ClientOnly from "@/shared/components/ClientOnly";
import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-10">
      <ClientOnly fallback={<div>Loading...</div>}>
        <CropAddForm />
        <ResultBox />
      </ClientOnly>
    </div>
  );
}