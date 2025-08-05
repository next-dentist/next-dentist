import { TreatmentMeta } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TreatmentMetaResponse {
  data: TreatmentMeta | null;
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
}

export function useTreatmentMeta(slug: string): TreatmentMetaResponse {
  const queryClient = useQueryClient();

  const fetchTreatmentMeta = async () => {
    const res = await fetch(`/api/treatments?slug=${slug}`);
    if (!res.ok) {
      throw new Error("Failed to fetch treatment meta");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["treatmentMeta", slug],
    queryFn: fetchTreatmentMeta,
  });

  const mutate = async () => {
    return queryClient.invalidateQueries({ queryKey: ["treatmentMeta"] });
  };

  return { data, isLoading, error, mutate };
}
