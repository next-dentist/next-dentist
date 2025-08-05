"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import TreatmentsPageClient from "./treatmentsPageClient";

export default function TreatmentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TreatmentsPageClient />
    </Suspense>
  );
}
