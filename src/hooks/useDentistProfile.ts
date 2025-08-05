import { Dentist } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface DentistProfileResponse {
  data: Dentist | null;
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
}

export function useDentistProfile(): DentistProfileResponse {
  const queryClient = useQueryClient();

  const fetchDentistProfile = async () => {
    const res = await fetch("/api/dentist/profile");
    if (!res.ok) {
      throw new Error("Failed to fetch dentist profile");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["dentistProfile"],
    queryFn: fetchDentistProfile,
  });

  const mutate = async () => {
    return queryClient.invalidateQueries({ queryKey: ["dentistProfile"] });
  };

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
