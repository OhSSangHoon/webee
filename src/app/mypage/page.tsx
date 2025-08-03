import {
  DiagnosisHistory,
  MyProfile,
  MySaleList,
  StoreRecommendBee,
} from "@/features";

export default function MyPage() {
  return (
    <div className="lg:w-[65%] flex flex-col gap-8 mx-auto pt-30 pb-10">
      {/* MySaleList와 MyProfile */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* MySaleList */}
        <div className="w-full md:w-[70%] order-2 md:order-1">
          <MySaleList />
        </div>
        
        {/* MyProfile */}
        <div className="w-full md:w-[30%] order-1 md:order-2">
          <MyProfile />
        </div>
      </div>

      {/* 추가 컴포넌트들 */}
      <StoreRecommendBee />
      <DiagnosisHistory />
    </div>
  );
}