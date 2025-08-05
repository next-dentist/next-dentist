"use client";

import AdminTreatmentAddForm from "@/components/admin/AdminTreatmentAddForm";
import { useParams } from "next/navigation";

export default function DentistTreatments() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <AdminTreatmentAddForm dentistId={id as string} />
    </div>
  );
}
