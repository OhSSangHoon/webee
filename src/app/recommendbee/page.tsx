import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-10">
      <CropAddForm />
      <ResultBox />
    </div>
  );
}
