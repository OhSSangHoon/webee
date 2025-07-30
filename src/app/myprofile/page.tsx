import { BusinessProfile, CropInfo } from "@/features";

export default function MyProfile() {
  return (
    <div className="max-w-[75%] flex flex-col items-center gap-10 mx-auto mb-20 pt-20">
        <BusinessProfile />
        <CropInfo />
    </div>
  );
}