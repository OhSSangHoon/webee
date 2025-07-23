import { DiagnosisHistory, MyProfile, MySaleList, StoreRecommendBee } from "@/features";
import ClientOnly from "@/shared/components/ClientOnly";

export default function MyPage() {
  return (
    <div className="max-w-[75%] flex flex-col gap-8 mx-auto pt-30">
      <ClientOnly fallback="Loading... ">
        <div className="flex flex-row gap-6">
            <MySaleList />
            <MyProfile />
        </div>
        <StoreRecommendBee />
        <DiagnosisHistory />
      </ClientOnly>
    </div>
  );
}