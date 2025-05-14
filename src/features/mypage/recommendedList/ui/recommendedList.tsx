import BeeWrapper from "./beeWrapper";

export default function RecommendedList() {
  return (
    <div className="custom-box2 w-full h-80 ">
      <div className="custom-box2-title">수정벌 추천 리스트 </div>

      <div className="min-w-full flex flex-row justify-around items-center gap-3">
        <BeeWrapper />
        <BeeWrapper />
        <BeeWrapper />
      </div>
    </div>
  );
}
