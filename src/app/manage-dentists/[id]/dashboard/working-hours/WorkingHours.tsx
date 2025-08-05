"use client";

import AdminBusinessHoursForm from "@/components/admin/AdminBusinessHoursForm";
import { useParams } from "next/navigation";

export default function WorkingHours() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <AdminBusinessHoursForm dentistId={id as string} />
    </div>
  );
}
