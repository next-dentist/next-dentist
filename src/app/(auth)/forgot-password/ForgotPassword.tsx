"use client";

import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHThree from "@/components/Headers/HeaderHThree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ArrowLeft, Send, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the schema for password reset form
const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = usePasswordReset();
  const [isOffline, setIsOffline] = useState(false);

  // Initialize form with zod validation
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onSubmit = async (values: PasswordResetFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      // Call the actual password reset API
      const response = await resetPassword(values.email);

      // Check if the email exists in the database
      if (response && "error" in response) {
        if (response.error === "No account found with this email address") {
          setError(
            "No account found with this email address. Please check your email or create an account."
          );
        } else if (response.error.includes("Failed to send")) {
          setError(
            "We had trouble sending the email. Please try again or contact support if the problem persists."
          );
        } else {
          setError(response.error || "An unexpected error occurred");
        }
        setIsLoading(false);
        return;
      }

      // Show success message
      setSubmitted(true);

      // Redirect to check-mail page after a delay
      setTimeout(() => {
        // Pass the email as a query parameter
        router.push(`/check-mail?email=${encodeURIComponent(values.email)}`);
      }, 2000);
    } catch (error) {
      console.error("Password reset request failed:", error);
      setError(
        "Failed to send reset link. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <WhiteRoundedBox className="p-8">
          <div className="flex flex-col gap-6">
            <HeaderHOne title="Reset Password" />

            {!submitted ? (
              <>
                <HeaderHThree title="Enter your email to receive a password reset link" />

                {isOffline && (
                  <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm mb-4">
                    You appear to be offline. You'll need an internet connection
                    to reset your password.
                  </div>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@example.com"
                              type="email"
                              {...field}
                              className={error ? "border-red-500" : ""}
                              onChange={(e) => {
                                field.onChange(e);
                                setError("");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="mr-2 h-4 w-4" /> Send Reset Link
                        </span>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        href="/register"
                        className="text-primary hover:underline inline-flex items-center text-sm"
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Create a new
                        account
                      </Link>
                    </div>
                  </form>
                </Form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                  <p className="font-medium">Reset link sent!</p>
                  <p className="text-sm mt-1">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
                <div className="animate-pulse">Redirecting...</div>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/login"
                className="text-primary hover:underline inline-flex items-center text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Link>
            </div>
          </div>
        </WhiteRoundedBox>
      </div>
    </div>
  );
};

export default ForgotPassword;
