"use client";

import { AiDiagnosis, AiDoctor } from "@/features";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Diagnosis() {
  return (
    <div className="flex flex-row justify-center items-center min-h-screen gap-10 my-10">
      <AiDiagnosis />
      <AiDoctor />
    </div>
  );
}
