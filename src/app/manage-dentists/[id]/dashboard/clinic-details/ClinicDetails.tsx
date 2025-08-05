"use client";

import BusinessDetailsForm from "@/components/admin/BusinessDetailsForm";
import { useParams } from "next/navigation";

export default function ClinicDetails() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <BusinessDetailsForm dentistId={id as string} />
    </div>
  );
}
