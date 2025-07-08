import {
  // BeehiveMap,
  DiagnosisHistory,
  MyProfile,
  //  MySaleList,
  StoreRecommendBee,
} from "@/features";
import ClientOnly from "@/shared/components/ClientOnly";

export default function MyPage() {
  return (
    <div className="max-w-[75%] flex flex-col gap-8 mx-auto py-20">
      <ClientOnly fallback="Loading... ">
        <MyProfile />
        <StoreRecommendBee />
        <DiagnosisHistory />
      </ClientOnly>
      {/*<MySaleList />*/}
    </div>
  );
}
