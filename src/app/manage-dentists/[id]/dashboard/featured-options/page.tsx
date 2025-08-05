import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import FeaturedOptions from "./FeaturedOptions";

export default function FeaturedOptionsPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
      <FeaturedOptions />
    </Suspense>
  );
}
