import ClientOnly from "@/shared/components/ClientOnly";
import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-10">
      <div className="lg:w-[65%] gap-10 flex flex-row items-center justify-center">
        <ClientOnly fallback={<div>Loading...</div>}>
          <CropAddForm />
          <ResultBox />
        </ClientOnly>
      </div>
    </div>
  );
}
