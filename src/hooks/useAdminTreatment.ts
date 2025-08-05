import { TreatmentMeta } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Custom hook for fetching and managing treatments
export const useAdminTreatments = ({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const [data, setData] = useState<{
    treatments: TreatmentMeta[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalCount: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) queryParams.append("search", search);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        const response = await fetch(
          `/api/admin/treatments?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch treatments");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching treatments:", error);
        setIsError(true);
        toast.error("Failed to load treatments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatments();
  }, [page, limit, search, sortBy, sortOrder]);

  const refetch = () => {
    setIsLoading(true);
    setIsError(false);
    // Re-trigger the effect
    // This is a bit of a hack, but it works for this purpose
    const temp: any = { ...data };
    setData(null);
    setTimeout(() => {
      setData(temp);
    }, 0);
  };

  return { data, isLoading, isError, refetch };
};

// Custom hook for updating treatment status
export const useUpdateTreatmentStatus = () => {
  const mutate = async ({
    treatmentId,
    status,
  }: {
    treatmentId: string;
    status: string;
  }) => {
    try {
      const response = await fetch(`/api/admin/treatments/${treatmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update treatment status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating treatment status:", error);
      throw error;
    }
  };

  return { mutate };
};

// Hook for deleting treatments
export const useDeleteTreatment = () => {
  const deleteTreatment = async (treatmentId: string) => {
    try {
      const response = await fetch(`/api/admin/treatments/${treatmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete treatment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting treatment:", error);
      throw error;
    }
  };

  return { deleteTreatment };
};
