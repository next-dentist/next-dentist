"use client";
import { useState } from "react";

type EmailVerificationResponse = {
  success?: boolean;
  available?: boolean;
  message?: string;
  error?: string;
};

export const useEmailVerification = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerificationSent, setIsVerificationSent] = useState<boolean>(false);
  const [response, setResponse] = useState<EmailVerificationResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const checkEmailAvailability = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setIsVerificationSent(false);

    try {
      const res = await fetch("/api/email-varification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check email availability");
      }

      setResponse(data);

      // If the response indicates success and verification was sent
      if (data.success && data.message?.includes("Verification link sent")) {
        setIsVerificationSent(true);
      }

      return data;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    isVerificationSent,
    response,
    error,
    checkEmailAvailability,
  };
};
