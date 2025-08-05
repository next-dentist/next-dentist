"use client";

import { getDentistById } from "@/app/actions/fetchDentists";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ManageDentistPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dentist", id],
    queryFn: () => getDentistById(id as string),
  });

  return (
    <div>
      <h1>Manage Dentist</h1>
    </div>
  );
}
