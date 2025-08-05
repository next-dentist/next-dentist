import { editSeoDetails } from "@/app/actions/treatment";
import { useState } from "react";

interface SeoDetails {
  seo_title: string;
  seo_description: string;
  seo_extra: string;
  seo_keyword: string;
}

interface UseAdminSEOEditReturn {
  updateSeoDetails: (id: string, data: SeoDetails) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useAdminSEOEdit(): UseAdminSEOEditReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const updateSeoDetails = async (id: string, data: SeoDetails) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const result = await editSeoDetails(id, data);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setError(result.error || "An unknown error occurred");
      }
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateSeoDetails,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
}
