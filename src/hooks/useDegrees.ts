// create a hook to fetch degrees

import { Degree } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetchDegreeById, fetchDegrees } from "../app/actions/fetchDegrees";

export const useDegrees = () => {
  const { data, isLoading, error, isError, refetch } = useQuery<
    Degree[],
    Error
  >({
    queryKey: ["degrees"],
    queryFn: async () => {
      try {
        const degrees = await fetchDegrees();
        return degrees;
      } catch (err) {
        console.error("Error fetching degrees:", err);
        throw new Error(
          err instanceof Error ? err.message : "Failed to fetch degrees"
        );
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    isError,
    refetch,
  };
};

export const useDegreeById = (id: string) => {
  const { data, isLoading, error, isError, refetch } = useQuery<Degree, Error>({
    queryKey: ["degree", id],
    queryFn: async () => {
      try {
        const degree = await fetchDegreeById(id);
        if (!degree) {
          throw new Error("Degree not found");
        }
        return degree;
      } catch (err) {
        console.error("Error fetching degree:", err);
        throw new Error(
          err instanceof Error ? err.message : "Failed to fetch degree"
        );
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    isError,
    refetch,
  };
};
