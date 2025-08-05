import { fetchTreatments } from "@/app/actions/fetchTreatments";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteTreatments(initialPageSize: number = 10) {
  const query = useInfiniteQuery({
    queryKey: ["treatments", "infinite"],

    queryFn: async ({ pageParam = 1 }) => {
      return fetchTreatments(pageParam, initialPageSize);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },

    getPreviousPageParam: (firstPage) => {
      if (firstPage.pagination.hasPreviousPage) {
        return firstPage.pagination.currentPage - 1;
      }
      return undefined;
    },
  });

  // Flatten all treatments from all pages
  const treatments = query.data?.pages.flatMap((page) => page.treatments) || [];

  // Extract pagination from the latest page
  const pagination = query.data?.pages[query.data.pages.length - 1]?.pagination;

  return {
    treatments,
    pagination,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
