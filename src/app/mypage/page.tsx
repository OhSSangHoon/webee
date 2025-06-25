import {
  BeehiveMap,
  DiagnosisHistory,
  MyProfile,
  MySaleList,
  StoreRecommendBee,
} from "@/features";

export default function MyPage() {
  return (
    <div className="max-w-[75%] flex flex-col gap-8 mx-auto pt-20">
      <div className="w-full grid grid-cols-[4fr_1fr] gap-7 h-[260px]">
        <div className="h-full">
          <BeehiveMap />
        </div>

        <div className="h-full">
          <MyProfile />
        </div>
      </div>
      <StoreRecommendBee />
      <DiagnosisHistory />
      <MySaleList />
    </div>
  );
}
