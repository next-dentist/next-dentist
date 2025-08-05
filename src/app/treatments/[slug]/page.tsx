"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionTwo } from "@/components/SectionTwo";
import { useTreatmentMeta } from "@/hooks/useTreatement";
import { TreatmentMeta } from "@/types";
import { useParams } from "next/navigation";
import SingleTreatment from "./SingleTreatment";
// add metadata

export default function TreatmentPage() {
  const { slug } = useParams();
  const {
    data: treatment,
    isLoading,
    error,
  } = useTreatmentMeta(slug as string);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SectionTwo className="py-4">
        <Breadcrumbs />
      </SectionTwo>
      <SingleTreatment treatment={treatment as TreatmentMeta} />
    </>
  );
}
