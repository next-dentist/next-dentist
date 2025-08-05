// useAdminTreatmentAdd.ts

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addTreatment } from "../app/actions/treatment";
import { TreatmentFormValues } from "../schemas";

/**
 * Hook to add a new treatment.
 * Provides loading, error, and success states for form handling.
 * Also exposes error details and reset functionality.
 */
export function useAdminTreatmentAdd() {
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const mutation = useMutation<
    NonNullable<Awaited<ReturnType<typeof addTreatment>>>["data"],
    Error & { details?: any },
    TreatmentFormValues
  >({
    mutationFn: async (values) => {
      setErrorDetails(null);
      const response = await addTreatment(values);
      if (!response.success) {
        // Attach details if present
        const error: any = new Error(response.error ?? "Failed to add treatment");
        if (response.details) {
          error.details = response.details;
        }
        throw error;
      }
      return response.data;
    },
    onError: (error: any) => {
      setErrorDetails(error.details ?? null);
      console.error("Add treatment failed:", error.message, error.details);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    errorDetails,
    reset: () => {
      mutation.reset();
      setErrorDetails(null);
    },
  };
}




