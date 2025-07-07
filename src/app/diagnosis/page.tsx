import ClientOnly from "@/shared/components/ClientOnly";
import { AiDiagnosis, AiDoctor } from "@/features";

export default function Diagnosis() {
  return (
    <div className="flex flex-row justify-center items-center min-h-screen mx-auto gap-10 py-10 lg:max-w-[70%]">
      <ClientOnly fallback={<div>Loading...</div>}>
        <AiDiagnosis />
        <AiDoctor />
      </ClientOnly>
    </div>
  );
}
