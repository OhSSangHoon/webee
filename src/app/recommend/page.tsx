import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex flex-col items-center gap-10 pt-30 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className=" text-4xl font-bold">수정벌 추천</h1>
        <h2 className="text-xl font-bold text-black/80">
          🥒작물 종류🍅와 농사 환경을 알려주시면, 정부의 농사 정보
          (농림수산식품부 자료)를 참고해 잘 맞는 수정벌을 알려드릴게요. 🐝💨
        </h2>
      </div>

      <div className="lg:w-[65%] gap-10 flex flex-row items-center justify-center">
        <title>수정벌 추천</title>
          <CropAddForm />
          <ResultBox />
      </div>
    </div>
  );
}
