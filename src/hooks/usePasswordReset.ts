// src/hooks/usePasswordReset.ts
import { useState } from "react";

interface PasswordResetResponse {
  message?: string;
  error?: string;
  success?: boolean;
  details?: any;
}

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PasswordResetResponse | null>(null);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return { error: "No account found with this email address" };
        }

        // Handle more specific error cases
        if (response.status === 500 && result.details) {
          console.error("Detailed error:", result.details);
          return {
            error: result.error || "Failed to reset password",
            details: result.details,
          };
        }

        return { error: result.error || "Failed to reset password" };
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error,
    data,
  };
};
