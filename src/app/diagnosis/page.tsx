import { AiDiagnosis, AiDoctor } from "@/features";

export default function Diagnosis() {
  return (
    <div className="flex flex-row justify-center items-center min-h-screen w-full max-w-7xl mx-auto gap-10 px-4 py-20">
      <AiDiagnosis />
      <AiDoctor />
    </div>
  );
}
