"use client";

import dynamic from "next/dynamic";

const AiDiagnosis = dynamic(() => import("@/features/AiDiagnosis/ui/AiDiagnosisUi"), { ssr: false });
const AiDoctor = dynamic(() => import("@/features/AiDoctor/ui/AiDoctUi"), { ssr: false });

export default function Diagnosis() {
  return (
    <div className="flex flex-row justify-center items-center min-h-screen mx-auto gap-10 py-10 lg:max-w-[70%]">
        <AiDiagnosis />
        <AiDoctor />
    </div>
  );
}