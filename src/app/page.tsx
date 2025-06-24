import { Weather2 } from "@/features";
import { DiagnosisBanner, QuickProfile } from "@/widgets";
import QuickMenu from "@/widgets/home/quickMenu/ui/quickMenu";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 max-w-screen-xl mx-auto px-4">
      <div className="flex flex-row gap-4">
        <Weather2 /> <QuickProfile />
      </div>

      <div className="flex flex-row gap-4">
        <QuickMenu />
        <DiagnosisBanner />
      </div>
    </div>
  );
}
