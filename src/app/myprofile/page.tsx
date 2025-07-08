import { BusinessProfile, CropInfo } from "@/features";
import ClientOnly from "@/shared/components/ClientOnly";

export default function MyProfile() {
  return (
    <div className="max-w-[75%] flex flex-col items-center gap-10 mx-auto mb-20 pt-20">
      <ClientOnly fallback={<div>Loading...</div>}>
        <BusinessProfile />
        <CropInfo />
      </ClientOnly>
    </div>
  );
}