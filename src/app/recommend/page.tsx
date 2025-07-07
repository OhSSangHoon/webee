import ClientOnly from "@/shared/components/ClientOnly";
import CropAddForm from "@/features/recommendBee/ui/CropAddForm";
import ResultBox from "@/features/recommendBee/ui/RecommendBeeResult";

export default function RecommendBee() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-10 p-10 ">
      <div className="flex flex-col justify-center items-start mt-8 px-20 gap-2">
        <h1 className=" text-4xl font-bold">수정벌 추천</h1>
        <h2 className="text-xl font-bold text-black/80">
          🥒작물 종류🍅와 농사 환경을 알려주시면, 정부의 농사 정보
          (농림수산식품부 자료)를 참고해 잘 맞는 수정벌을 알려드릴게요. 🐝💨
        </h2>
      </div>

      <div className="lg:w-[65%] gap-10 flex flex-row items-center justify-center">
        <title>수정벌 추천</title>
        <ClientOnly fallback={<div>Loading...</div>}>
          <CropAddForm />
          <ResultBox />
        </ClientOnly>
      </div>
    </div>
  );
}
