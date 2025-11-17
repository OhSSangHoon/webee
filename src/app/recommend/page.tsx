"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRecommendBee } from "@/features/recommendBee/model/useRecommendation";

const CropAddForm = dynamic(
  () => import("@/features/recommendBee/ui/cropAddForm"),
  { ssr: false }
);
const ResultBox = dynamic(
  () => import("@/features/recommendBee/ui/recommendBeeResult"),
  { ssr: false }
);

export default function RecommendBee() {
  const { loading } = useRecommendBee();
  const [step, setStep] = useState<1 | 2>(1);
  useEffect(() => {
    if (loading) {
      setStep(2);
    }
  }, [loading]);

  return (
    <div className=" w-[335px] mx-auto space-y-6">
      <title>수정벌 추천</title>

      {step === 1 && <CropAddForm />}
      {step === 2 && <ResultBox />}
    </div>
  );
}
