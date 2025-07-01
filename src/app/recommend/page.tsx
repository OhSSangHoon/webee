import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="lg:w-[65%] gap-10 flex flex-row items-center justify-center">
        <CropAddForm />
        <ResultBox />
      </div>
    </div>
  );
}
