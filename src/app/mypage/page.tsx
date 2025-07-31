import {
  DiagnosisHistory,
  MyProfile,
  MySaleList,
  StoreRecommendBee,
} from "@/features";

export default function MyPage() {
  return (
    <div className="max-w-[75%] flex flex-col gap-8 mx-auto pt-30 pb-10">
      <div className="flex flex-row gap-6 w-full">
        <MySaleList />
        <MyProfile />
      </div>
      <StoreRecommendBee />
      <DiagnosisHistory />
    </div>
  );
}
