// src/hooks/useEmailSend.ts
"use client";
import { useState } from "react";

interface EmailSendParams {
  email: string;
  name: string;
  template_id: string;
}

interface EmailSendResponse {
  message: string;
  data?: any;
}

export const useEmailSend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EmailSendResponse | null>(null);

  const sendEmail = async (params: EmailSendParams) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }

      if (!result.message) {
        throw new Error("Invalid response format from server");
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
    error,
    data,
  };
};
