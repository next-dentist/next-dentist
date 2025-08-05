import { Dentist } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Add a debounced search hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export interface AdminDentistsResponse {
  dentists: Dentist[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
  };
  filters: {
    cities: string[];
    specialities: string[];
    statuses: string[];
  };
}

export interface AdminDentistsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  city?: string;
  speciality?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useAdminDentists = (params: AdminDentistsParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    city,
    speciality,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  // Only include search if it's at least 3 characters
  const shouldSearch = search && search.length >= 3;

  return useQuery<AdminDentistsResponse>({
    queryKey: [
      "admin-dentists",
      page,
      limit,
      shouldSearch ? search : null,
      status,
      city,
      speciality,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        // Encode search query to prevent special characters from causing issues
        if (shouldSearch)
          queryParams.append("search", encodeURIComponent(search || ""));
        if (status) queryParams.append("status", status);
        if (city) queryParams.append("city", city);
        if (speciality) queryParams.append("speciality", speciality);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        const response = await axios.get(
          `/api/admin/dentists?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching dentists:", error);
        // Show error toast
        toast.error(
          `Failed to load dentists: ${
            axios.isAxiosError(error) && error.response?.data?.error
              ? error.response.data.error
              : error instanceof Error
              ? error.message
              : "Unknown error"
          }`
        );
        throw error;
      }
    },
    // Speed up refreshing by removing stale time
    staleTime: 0,
    // Disable caching to always get fresh data
    // Make the query refresh when window regains focus
    refetchOnWindowFocus: true,
    // No delay when refetching
    refetchInterval: false,
    // Ensure UI updates immediately with whatever data we have
    retry: 1, // Only retry once to avoid hammering the server with bad queries
  });
};

// Update the status hook to immediately invalidate and refetch
export const useUpdateDentistStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dentistId,
      status,
    }: {
      dentistId: string;
      status: string;
    }) => {
      try {
        const response = await axios.patch(`/api/admin/dentists/${dentistId}`, {
          status,
        });
        return response.data;
      } catch (error) {
        console.error("Status update error:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Force immediate refetch of the data
      queryClient.invalidateQueries({
        queryKey: ["admin-dentists"],
      });

      // Optimistically update the UI
      queryClient.setQueriesData<AdminDentistsResponse | undefined>(
        { queryKey: ["admin-dentists"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            dentists: oldData.dentists.map((dentist) =>
              dentist.id === variables.dentistId
                ? { ...dentist, status: variables.status }
                : dentist
            ),
          };
        }
      );

      toast.success(`Dentist status updated to ${variables.status}`);
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";

      toast.error(`Update failed: ${errorMessage}`);
      console.error("Full error:", error);
    },
  });
};

export const useUpdateDentist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dentistId,
      data,
    }: {
      dentistId: string;
      data: Partial<Dentist>;
    }) => {
      try {
        const response = await axios.patch(
          `/api/admin/dentists/${dentistId}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Dentist update error:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["admin-dentists"],
      });

      // Invalidate specific dentist query if you have one
      queryClient.invalidateQueries({
        queryKey: ["dentist", variables.dentistId],
      });

      toast.success("Dentist information updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";

      toast.error(`Update failed: ${errorMessage}`);
    },
  });
};
