import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DentistTreatments from "./DentistTreatments";

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <DentistTreatments />
      </Suspense>
    </div>
  );
}
