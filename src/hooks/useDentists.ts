import { fetchDentistsByCity } from "@/app/actions/fetchDentists";
import {
  deleteDentist,
  fetchDentistById,
  searchDentistsByLocation,
} from "@/services/dentistService";
import { Degree, Dentist } from "@prisma/client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Keys for queries
export const dentistKeys = {
  all: ["dentists"] as const,
  details: (id: number) => [...dentistKeys.all, id] as const,
  slug: (slug: string) => [...dentistKeys.all, "slug", slug] as const,
  search: (location: string) =>
    [...dentistKeys.all, "search", location] as const,
  degrees: (dentistId: string) =>
    [...dentistKeys.all, "degrees", dentistId] as const,
};

// Hook to fetch all dentists
export function useAllDentists() {
  return useQuery({
    queryKey: ["dentists", "all"],
    queryFn: async () => {
      const response = await fetch("/api/dentists");
      if (!response.ok) {
        throw new Error("Failed to fetch dentists");
      }
      const data = await response.json();

      return data.dentists;
    },
  });
}

// Hook to fetch a single dentist by ID
export function useDentist(id: number) {
  return useQuery({
    queryKey: dentistKeys.details(id),
    queryFn: () => fetchDentistById(id),
    enabled: !!id, // Only run if id is provided
  });
}

// Type for business hours
interface BusinessHour {
  from: string;
  to: string;
}

interface DayBusinessHours {
  Name: string;
  Hours: BusinessHour[];
  Closed: boolean;
}

interface BusinessHours {
  [key: string]: DayBusinessHours;
}

// Hook to fetch a single dentist by slug
export function useDentistBySlug(slug: string) {
  return useQuery({
    queryKey: ["dentist", slug],
    queryFn: async () => {
      const response = await fetch(`/api/dentists/slug/${slug}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to fetch dentist (status ${response.status}): ${
            errorData?.error || response.statusText
          }`
        );
      }

      const data = await response.json();
      if (!data || typeof data !== "object" || !data.id) {
        throw new Error("Invalid dentist data received");
      }
      return data as Dentist;
    },
    enabled: !!slug,
  });
}

// Hook to fetch dentist degrees using the API endpoint
export function useDentistDegrees(dentistId: string | undefined) {
  return useQuery({
    queryKey: dentistKeys.degrees(dentistId || "undefined"),
    queryFn: async () => {
      if (!dentistId) {
        // This error should ideally not be thrown if 'enabled' works correctly,
        // but it's a safeguard.
        throw new Error("Dentist ID is required to fetch degrees.");
      }
      // Fetch from the dedicated API route
      const response = await fetch(`/api/dentists/${dentistId}/degrees`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to fetch dentist degrees (status ${response.status}): ${
            errorData?.error || response.statusText
          }`
        );
      }
      const data = await response.json();
      // Validate the response structure
      if (!data || !Array.isArray(data.degrees)) {
        throw new Error("Invalid degrees data received from API");
      }
      // Expect the API to return the actual Degree objects
      return data.degrees as Degree[];
    },
    // Keep this enabled flag - crucial for sequential fetching
    enabled: !!dentistId,
    // Keep retry and staleTime if desired
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to search dentists by location
export function useSearchDentists(location: string) {
  return useQuery({
    queryKey: dentistKeys.search(location),
    queryFn: () => searchDentistsByLocation(location),
    enabled: !!location, // Only run if location is provided
  });
}

// Define a type for the dentist creation payload that matches the API expectations
type DentistCreatePayload = {
  name: string;
  phone: string;
  email: string;
  bio?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  website?: string;
  speciality: string;
  image?: string;
  slug: string;
  user?: { connect: { id: string } };
  userId?: string;
  businessHours?: any;
  dentistDegree?: Degree[]; // Allow setting degrees on creation if needed
};

// Hook for adding a new dentist
export function useAddDentist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dentistData: DentistCreatePayload) => {
      try {
        const response = await fetch("/api/dentists/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dentistData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Extract the error message from the response
          const errorMessage = data.error || "Failed to add dentist";
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        // Rethrow to be caught by onError
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dentistKeys.all });
    },
  });
}

// Hook for updating a dentist
export function useUpdateDentist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dentist> }) =>
      fetch(`/api/admin/dentists/${id}`, {
        // Assuming admin endpoint for updates
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to update dentist (status ${res.status})`
          );
        }
        return res.json();
      }),
    onSuccess: (updatedDentist: Dentist) => {
      // Expect Dentist type in return
      // Update the specific dentist query cache
      queryClient.setQueryData(
        ["adminDentist", updatedDentist.id],
        updatedDentist
      );

      // Optionally update other relevant queries like slug-based fetch if applicable
      if (updatedDentist.slug) {
        queryClient.setQueryData(
          ["dentist", updatedDentist.slug],
          updatedDentist
        );
      }

      // Invalidate broader queries to reflect changes in lists
      queryClient.invalidateQueries({ queryKey: ["adminDentists"] }); // Example admin list query
      queryClient.invalidateQueries({ queryKey: dentistKeys.all }); // General dentist list

      // You might also need to invalidate the specific query used by useAdminDentistFetch
      queryClient.invalidateQueries({
        queryKey: ["adminDentist", updatedDentist.id],
      });
    },
    onError: (error) => {
      console.error("Update failed:", error);
      // Handle error feedback to the user if needed
    },
  });
}

// Hook for deleting a dentist
export function useDeleteDentist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDentist(id),
    onSuccess: (_, id) => {
      // Remove the dentist from the cache
      queryClient.removeQueries({ queryKey: dentistKeys.details(id) });

      // Invalidate the list query to refetch
      queryClient.invalidateQueries({ queryKey: dentistKeys.all });
    },
  });
}

// Hook to fetch recently joined dentists
export function useRecentDentists(limit = 8) {
  return useQuery({
    queryKey: ["recentDentists", limit],
    queryFn: async () => {
      const response = await fetch(`/api/dentists/recent?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent dentists");
      }
      const data = await response.json();
      return data.dentists as Dentist[];
    },
  });
}

export function useDentistsByCity(city: string) {
  return useQuery({
    queryKey: ["dentists", "city", city],
    queryFn: () => fetchDentistsByCity(city),
  });
}

// Fetch dentists with infinite pagination
export function useInfiniteDentistsByCity(city: string) {
  return useInfiniteQuery({
    queryKey: ["dentists", city],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/dentists?city=${city}&page=${pageParam}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dentists");
      }
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}
