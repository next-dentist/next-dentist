"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import WorkingHours from "./WorkingHours";

export default function WorkingHoursPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
      <WorkingHours />
    </Suspense>
  );
}
