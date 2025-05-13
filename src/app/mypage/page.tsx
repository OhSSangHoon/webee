import {
  BeehiveMap,
  DiagnosisHistory,
  MyProfile,
  MySaleList,
  RecommendedList,
} from "@/features";

export default function myPage() {
  return (
    <div className=" max-w-[75%] flex flex-col gap-10 mx-auto">
      <div className="flex flex-row justify-between gap-7">
        <BeehiveMap />
        <MyProfile />
      </div>
      <RecommendedList />
      <DiagnosisHistory />
      <MySaleList />
    </div>
  );
}
