"use client";
import DentistBasicDetailsForm from "@/components/admin/DentistBasicDetailsForm";
import { useParams } from "next/navigation";

export default function BasicDetails() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <DentistBasicDetailsForm dentistId={id as string} />
    </div>
  );
}
