"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import DentistInAhmedabadClient from "./ahmedabad";
export default function DentistInAhmedabadPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DentistInAhmedabadClient />
    </Suspense>
  );
}
