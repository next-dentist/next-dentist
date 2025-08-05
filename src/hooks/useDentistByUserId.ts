"use client";

// hooks/useDentistByUserId.ts
// tanstack query with loading and error handling

import { getDentistByUserId } from "@/app/actions/fetchDentists";
import { useQuery } from "@tanstack/react-query";

export const useDentistByUserId = (userId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dentist", userId],
    queryFn: () => {
      if (!userId) return null;
      return getDentistByUserId(userId);
    },
    // Don't run the query if userId is undefined
    enabled: !!userId,
  });

  return { data, isLoading, error };
};

export default useDentistByUserId;
