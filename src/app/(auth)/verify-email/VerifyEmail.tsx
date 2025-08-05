"use client";

import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing");
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setIsVerified(true);
        } else {
          setError(data.error || "Failed to verify email");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("An unexpected error occurred during verification");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container mx-auto py-16 px-4">
      <WhiteRoundedBox className="max-w-md mx-auto p-8 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verifying Email</h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "We couldn't verify your email address. The link may be invalid or expired."}
            </p>
            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Register Again</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </WhiteRoundedBox>
    </div>
  );
}
