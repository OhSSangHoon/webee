import {
  DiagnosisBanner,
  QuickProfile,
  RecommendBee,
  Weather,
} from "@/widgets";
import QuickMenu from "@/widgets/quickMenu/ui/quickMenu";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 max-w-screen-xl mx-auto px-4">
      <div className="flex flex-row gap-4">
        <RecommendBee /> <QuickProfile />
      </div>
      <Weather />
      <div className="flex flex-row gap-4">
        <QuickMenu />
        <DiagnosisBanner />
      </div>
    </div>
  );
}
