"use client";

import SpecialInfoForm from "@/components/admin/SpecialInfoForm";
import { useParams } from "next/navigation";

export default function FeaturedOptions() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <SpecialInfoForm dentistId={id as string} />
    </div>
  );
}
