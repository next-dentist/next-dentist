import { fetchDentistsByCity } from "@/app/actions/fetchDentists";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Dentist {
  id: string;
  name: string;
  speciality: string;
  image: string;
  fees: number;
  phone: string;
  city: string;
  state: string;
  country: string;
  slug: string;
  images?: any[];
  distance?: number;
  distanceText?: string;
}

interface PaginatedResponse {
  dentists: Dentist[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export function useInfiniteDentists(searchParams?: URLSearchParams) {
  // Extract search parameters with support for new filters
  const city = searchParams?.get("city") || "";
  const specialization = searchParams?.get("specialization") || "";
  const treatment = searchParams?.get("treatment") || "";
  const name = searchParams?.get("name") || "";
  const location = searchParams?.get("location") || "";
  const search = searchParams?.get("search") || ""; // General search parameter
  const nearby = searchParams?.get("nearby") || "true"; // Default to nearby search
  const lat = searchParams?.get("lat") || "";
  const lon = searchParams?.get("lon") || "";

  // Build query string from search parameters
  const buildQueryString = (pageParam: number) => {
    const params = new URLSearchParams();
    params.append("page", pageParam.toString());
    params.append("limit", "12"); // Increased for better grid layout

    // Add all filters if they exist
    if (city) params.append("city", city);
    if (specialization) params.append("specialization", specialization);
    if (treatment) params.append("treatment", treatment);
    if (name) params.append("name", name);
    if (location) params.append("location", location);
    if (search) params.append("search", search);
    if (nearby) params.append("nearby", nearby);
    if (lat) params.append("lat", lat);
    if (lon) params.append("lon", lon);

    return params.toString();
  };

  return useInfiniteQuery({
    queryKey: ["dentists", { 
      city, 
      specialization, 
      treatment, 
      name, 
      location, 
      search,
      nearby, 
      lat, 
      lon 
    }],
    queryFn: async ({ pageParam = 1 }): Promise<PaginatedResponse> => {
      const queryString = buildQueryString(pageParam);
      const response = await fetch(`/api/dentists?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch dentists");
      }

      const data = await response.json();

      // Ensure dentists array exists, default to empty array if not
      return {
        dentists: data.dentists || [],
        pagination: data.pagination || {
          total: 0,
          page: pageParam,
          limit: 12,
          hasMore: false,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      // Safely check if pagination exists before accessing hasMore
      if (!lastPage || !lastPage.pagination) return undefined;
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

export function useInfiniteDentistsByCity(city: string) {
  return useInfiniteQuery({
    queryKey: ["dentists", "city", city],
    queryFn: () => fetchDentistsByCity(city),
    getNextPageParam: (lastPage) => {
      // Safely check if pagination exists before accessing hasMore
      if (!lastPage || !lastPage.pagination) return undefined;
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
