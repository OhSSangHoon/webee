import {
  DiagnosisHistory,
  MyProfile,
  MySaleList,
  StoreRecommendBee,
} from "@/features";

export default function MyPage() {
  return (
    <div className="w-[90%] xl:w-[65%] flex flex-col gap-8 mx-auto pt-30 pb-10">
      <MyProfile />
      <MySaleList />
      <StoreRecommendBee />
      <DiagnosisHistory />
    </div>
  );
}
