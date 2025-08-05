"use client";

import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHThree from "@/components/Headers/HeaderHThree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckMail() {
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [localError, setLocalError] = useState("");
  const { resetPassword, isLoading, error, data } = usePasswordReset();
  const [expiryTime, setExpiryTime] = useState(60); // 60 minutes

  // Get email from URL query parameter
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) {
      return;
    }

    setIsResending(true);
    setResendSuccess(false);
    setUserNotFound(false);
    setLocalError("");

    try {
      const response = await resetPassword(email);

      if (response && "error" in response) {
        if (response.error === "No account found with this email address") {
          setUserNotFound(true);
        } else {
          // Show specific error message from the API
          console.error("Reset error:", response.error);
          setLocalError(response.error);
        }
        return;
      }

      setResendSuccess(true);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to resend email:", error);
      setLocalError(
        typeof error === "string"
          ? error
          : "Failed to resend the email. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <WhiteRoundedBox className="p-8">
          <div className="flex flex-col gap-6 items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Mail className="h-12 w-12 text-primary" />
            </div>

            <HeaderHOne title="Check Your Email" />

            <HeaderHThree title="We've sent you a verification link" />

            <p className="text-gray-600">
              We've sent a verification email to your inbox. Please click the
              link in the email to verify your account.
            </p>

            <div className="w-full space-y-4 mt-2">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm text-left block font-medium"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendEmail}
                disabled={isResending || !email}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4" /> Resend Email
                  </span>
                )}
              </Button>

              {resendSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  Email resent successfully!
                </div>
              )}

              {userNotFound && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  No account found with this email address. Please create an
                  account first.
                </div>
              )}

              {localError && !userNotFound && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {localError}
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-primary hover:underline inline-flex items-center text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              <p>
                If you don't see the email, check your spam folder or make sure
                you entered the correct email address.
              </p>
              <p className="mt-2">
                The reset link will expire in{" "}
                <span className="font-medium">{expiryTime} minutes</span>.
              </p>
            </div>
          </div>
        </WhiteRoundedBox>
      </div>
    </div>
  );
}
