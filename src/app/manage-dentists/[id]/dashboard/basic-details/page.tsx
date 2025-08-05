import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import BasicDetails from "./BasicDetails";

export default function BasicDetailsPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
      <BasicDetails />
    </Suspense>
  );
}
