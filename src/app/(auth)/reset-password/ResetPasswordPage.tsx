"use client";

import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHThree from "@/components/Headers/HeaderHThree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { usePasswordChange } from "@/hooks/usePasswordChange";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

// Password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [tokenExpired, setTokenExpired] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { changePassword, isLoading, error } = usePasswordChange();

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(Math.min(5, strength));
  }, [password]);

  // Check if token exists when component mounts
  useEffect(() => {
    if (!token) {
      setTokenExpired(true);
      setLocalError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "Too weak";
    if (passwordStrength === 1) return "Very weak";
    if (passwordStrength === 2) return "Weak";
    if (passwordStrength === 3) return "Medium";
    if (passwordStrength === 4) return "Strong";
    return "Very strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 4) return "bg-green-500";
    return "bg-green-600";
  };

  const validateForm = () => {
    if (!token) {
      setLocalError("Invalid reset link");
      return false;
    }

    try {
      passwordSchema.parse({ password, confirmPassword });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLocalError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!validateForm()) {
      return;
    }

    try {
      const result = await changePassword(token!, password);

      if (result.error) {
        if (result.error.includes("expired")) {
          setTokenExpired(true);
        }
        setLocalError(result.error);
      } else {
        setIsSuccess(true);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setLocalError("Failed to reset password. Please try again.");
    }
  };

  // Requirements display component
  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <X size={16} className="text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <WhiteRoundedBox className="p-8">
          <div className="flex flex-col gap-6">
            <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
              <KeyRound className="h-12 w-12 text-primary" />
            </div>

            <HeaderHOne title="Reset Password" />

            {tokenExpired ? (
              <div className="text-center space-y-4">
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
                  This reset link has expired or is invalid. Please request a
                  new password reset.
                </div>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Request new reset link
                </Link>
              </div>
            ) : isSuccess ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800">
                    Password Reset Successful!
                  </h3>
                  <p className="text-sm mt-1">
                    Your password has been updated. You can now log in with your
                    new password.
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Redirecting to login page...
                </p>
                <Link
                  href="/login"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </div>
            ) : (
              <>
                <HeaderHThree title="Create a new secure password" />

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setLocalError("");
                        }}
                        placeholder="Enter your new password"
                        className="pr-10"
                        aria-describedby="password-requirements"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Password strength:
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength <= 2
                                ? "text-red-600"
                                : passwordStrength === 3
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {getStrengthLabel()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password requirements */}
                    <div
                      id="password-requirements"
                      className="mt-3 space-y-1.5 text-xs"
                    >
                      <PasswordRequirement
                        met={password.length >= 8}
                        text="At least 8 characters"
                      />
                      <PasswordRequirement
                        met={/[A-Z]/.test(password)}
                        text="At least one uppercase letter"
                      />
                      <PasswordRequirement
                        met={/[a-z]/.test(password)}
                        text="At least one lowercase letter"
                      />
                      <PasswordRequirement
                        met={/\d/.test(password)}
                        text="At least one number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setLocalError("");
                        }}
                        placeholder="Confirm your new password"
                        className={
                          confirmPassword && password !== confirmPassword
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  {(localError || error) && (
                    <div className="space-y-4">
                      <div
                        className="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
                        role="alert"
                      >
                        {localError || error}
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
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
                        Updating Password...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </>
            )}

            {!isSuccess && !tokenExpired && (
              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-primary hover:underline inline-flex items-center text-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </div>
            )}
          </div>
        </WhiteRoundedBox>
      </div>
    </div>
  );
}
