// src/hooks/usePasswordChange.ts

import { useState } from "react";

interface PasswordChangeResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PasswordChangeResponse | null>(null);

  // Function to validate password locally
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }

    return null;
  };

  const changePassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    // First validate password locally for quicker feedback
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return { error: validationError };
    }

    try {
      const response = await fetch("/api/password-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to change password");
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to change password. Please try again.";

      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    data,
    validatePassword,
  };
};
