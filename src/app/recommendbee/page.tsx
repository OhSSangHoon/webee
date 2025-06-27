"use client";

import CropAddForm from "@/features/recommendBee/ui/cropAddForm";
import ResultBox from "@/features/recommendBee/ui/recommendBeeResult";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RecommendBee() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 p-10">
      <CropAddForm />
      <ResultBox />
    </div>
  );
}
