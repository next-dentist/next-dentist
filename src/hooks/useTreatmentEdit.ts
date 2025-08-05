import { TreatmentMeta } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTreatmentEdit() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    any,
    Error,
    { treatmentId: string; data: Partial<TreatmentMeta> }
  >({
    mutationFn: async ({ treatmentId, data }) => {
      const response = await fetch(`/api/admin/treatments/${treatmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update treatment");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Treatment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update treatment", {
        description: error.message || "Please try again later",
      });
    },
  });

  // Support both naming conventions (for different React Query versions)
  return {
    ...mutation,
    isLoading: mutation.isPending || mutation.isLoading,
  };
}
