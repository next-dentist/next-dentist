import { Review, ReviewStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Extended Review type with relations
export interface ReviewWithRelations extends Review {
  dentist: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  subratings: {
    id: string;
    value: number;
    category: {
      id: string;
      name: string;
      label: string | null;
    };
  }[];
}

// Debounce hook reused from dentists
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

export interface AdminReviewsResponse {
  reviews: ReviewWithRelations[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
  };
  filters: {
    statuses: ReviewStatus[];
    dentistNames: string[];
  };
}

export interface AdminReviewsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReviewStatus;
  dentistId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useAdminReviews = (params: AdminReviewsParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    dentistId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  // Only include search if it's at least 3 characters
  const shouldSearch = search && search.length >= 3;

  return useQuery<AdminReviewsResponse>({
    queryKey: [
      "admin-reviews",
      page,
      limit,
      shouldSearch ? search : null,
      status,
      dentistId,
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
        if (dentistId) queryParams.append("dentistId", dentistId);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        const response = await axios.get(
          `/api/admin/reviews?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error(
          `Failed to load reviews: ${
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
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: false,
    retry: 1,
  });
};

// Update review status hook
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: ReviewStatus;
    }) => {
      try {
        const response = await axios.patch(`/api/admin/reviews/${reviewId}`, {
          status,
        });
        return response.data;
      } catch (error) {
        console.error("Review status update error:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Force immediate refetch of the data
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });

      // Optimistically update the UI
      queryClient.setQueriesData<AdminReviewsResponse | undefined>(
        { queryKey: ["admin-reviews"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            reviews: oldData.reviews.map((review) =>
              review.id === variables.reviewId
                ? { ...review, status: variables.status }
                : review
            ),
          };
        }
      );

      toast.success(`Review status updated to ${variables.status.toLowerCase()}`);
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

// Delete review hook
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      try {
        const response = await axios.delete(`/api/admin/reviews/${reviewId}`);
        return response.data;
      } catch (error) {
        console.error("Review deletion error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });

      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.details
          ? error.response.data.details
          : error instanceof Error
          ? error.message
          : "Unknown error";

      toast.error(`Delete failed: ${errorMessage}`);
    },
  });
}; 