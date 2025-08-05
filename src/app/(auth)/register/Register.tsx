"use client";

import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHThree from "@/components/Headers/HeaderHThree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the form schema with Zod
const registerFormSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
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

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const {
    checkEmailAvailability,
    isLoading: isEmailLoading,
    error,
  } = useEmailVerification();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Calculate password strength whenever password changes
  useEffect(() => {
    const password = form.watch("password");

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
  }, [form.watch("password")]);

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

  // Password requirement component
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

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // Check email availability and send verification link
      const res = await checkEmailAvailability(values.email, values.password);

      if (res.available === false) {
        toast.error("Email Unavailable", {
          description: "This email is already registered",
        });
        return;
      }

      if (res.success) {
        // Store password in localStorage temporarily (not secure for production)
        // In production, you might consider more secure options or simply ask user to input password again
        localStorage.setItem(
          "pendingRegistration",
          JSON.stringify({
            email: values.email,
            password: values.password,
            name: values.name || "",
          })
        );

        toast.success("Verification Email Sent", {
          description:
            "Please check your inbox and verify your email to complete registration",
        });

        // Redirect to a confirmation page or stay on the same page with a different UI state
        router.push("/verify-email-sent");
      } else {
        toast.error("Registration Failed", {
          description: res.error || "Please try again later",
        });
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error("Registration Failed", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <WhiteRoundedBox className="p-8">
          <div className="flex flex-col gap-6">
            <HeaderHOne title="Create Account" />
            <HeaderHThree title="Join our dental community" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  type="text"
                  placeholder="John Doe"
                  className={form.formState.errors.name ? "border-red-500" : ""}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...form.register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className={
                    form.formState.errors.email ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={
                      form.formState.errors.password
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                    aria-describedby="password-requirements"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password strength indicator */}
                {form.watch("password") && (
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
                    met={form.watch("password")?.length >= 8 || false}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={/[A-Z]/.test(form.watch("password") || "")}
                    text="At least one uppercase letter"
                  />
                  <PasswordRequirement
                    met={/[a-z]/.test(form.watch("password") || "")}
                    text="At least one lowercase letter"
                  />
                  <PasswordRequirement
                    met={/\d/.test(form.watch("password") || "")}
                    text="At least one number"
                  />
                  <PasswordRequirement
                    met={/[^A-Za-z0-9]/.test(form.watch("password") || "")}
                    text="At least one special character"
                  />
                </div>

                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    {...form.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={
                      form.formState.errors.confirmPassword
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </span>
                )}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </WhiteRoundedBox>
      </div>
    </div>
  );
};

export default Register;
