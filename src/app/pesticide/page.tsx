import { Pesticide } from "@/features";
import ClientOnly from "@/shared/components/ClientOnly";

export default function FindPesticide() {
  return (
    <ClientOnly fallback="Loading...">
      <Pesticide />
    </ClientOnly>
  );
}
