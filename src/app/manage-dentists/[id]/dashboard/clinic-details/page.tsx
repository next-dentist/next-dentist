// clinic details page
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import ClinicDetails from "./ClinicDetails";

export default function ClinicDetailsPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
      <ClinicDetails />
    </Suspense>
  );
}
