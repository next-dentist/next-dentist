'use client';

import {
  registerWithWhatsApp,
  sendWhatsAppOTP,
  verifyWhatsAppOTP,
} from '@/app/actions/whatsapp-auth';
import HeaderHOne from '@/components/Headers/HeaderHOne';
import HeaderHThree from '@/components/Headers/HeaderHThree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MessageSquare, RefreshCw } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OTPFormValues = z.infer<typeof otpFormSchema>;

const VerifyWhatsAppOTPContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get data from URL params
  const phone = searchParams?.get('phone');
  const name = searchParams?.get('name');
  const action = searchParams?.get('action'); // 'register' or 'login'

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start countdown on component mount
  useEffect(() => {
    setCountdown(60); // 60 seconds before allowing resend
  }, []);

  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      router.push('/register');
    }
  }, [phone, router]);

  if (!phone) {
    return null;
  }

  const formatPhone = (phoneNumber: string) => {
    // Format phone number for display (hide middle digits)
    const countryCode = phoneNumber.substring(0, 3);
    const lastFour = phoneNumber.slice(-4);
    const middle = '*'.repeat(phoneNumber.length - 7);
    return `${countryCode}${middle}${lastFour}`;
  };

  const onSubmit = async (values: OTPFormValues) => {
    setIsLoading(true);

    try {
      // Verify OTP
      const verifyResult = await verifyWhatsAppOTP(phone, values.otp);

      if (!verifyResult.success) {
        toast.error('Verification Failed', {
          description: verifyResult.error,
        });
        return;
      }

      if (action === 'register') {
        // Register new user
        const registerResult = await registerWithWhatsApp(
          phone,
          name || undefined
        );

        if (!registerResult.success) {
          toast.error('Registration Failed', {
            description: registerResult.error,
          });
          return;
        }

        toast.success('Registration Successful', {
          description: 'Your account has been created successfully',
        });
      }

      // Sign in user using WhatsApp credentials
      const signInResult = await signIn('whatsapp', {
        phone,
        verified: 'true',
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Login Failed', {
          description: 'Failed to sign in. Please try again.',
        });
        return;
      }

      toast.success(
        action === 'register' ? 'Registration Complete' : 'Login Successful',
        {
          description: 'Redirecting to your dashboard...',
        }
      );

      // Redirect to dashboard or intended page
      router.push('/profile');
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      toast.error('Verification Failed', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const result = await sendWhatsAppOTP(phone);

      if (result.success) {
        toast.success('OTP Resent', {
          description:
            'Please check your WhatsApp for the new verification code',
        });
        setCountdown(60); // Reset countdown
        form.reset(); // Clear the form
      } else {
        toast.error('Failed to Resend OTP', {
          description: result.error,
        });
      }
    } catch (error: any) {
      toast.error('Error', {
        description: 'Failed to resend OTP. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-center">
          <HeaderHOne title="Verify Your Number" />
          <HeaderHThree title="Enter the 6-digit code sent to your WhatsApp" />
        </div>

        <div className="mb-4 flex items-center justify-center sm:mb-6">
          <div className="rounded-full bg-green-100 p-2 sm:p-3">
            <MessageSquare className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 sm:text-base">
            We sent a verification code to
          </p>
          <p className="font-semibold text-gray-900">{formatPhone(phone)}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              {...form.register('otp')}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className={`text-center font-mono text-lg tracking-widest ${
                form.formState.errors.otp ? 'border-red-500' : ''
              }`}
              autoComplete="one-time-code"
            />
            {form.formState.errors.otp && (
              <p className="text-sm text-red-500">
                {form.formState.errors.otp.message}
              </p>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-500">Code expires in 5 minutes</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-2 sm:py-3"
            disabled={isLoading || form.watch('otp').length !== 6}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white sm:mr-3 sm:h-5 sm:w-5"
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
                <span className="text-sm sm:text-base">Verifying...</span>
              </span>
            ) : (
              <span className="text-sm sm:text-base">Verify & Continue</span>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-600 sm:text-sm">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            onClick={handleResendOTP}
            disabled={isResending || countdown > 0}
            className="text-primary mt-1 h-auto p-0 font-medium hover:underline"
          >
            {isResending ? (
              <span className="flex items-center">
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Resending...
              </span>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Resend Code'
            )}
          </Button>
        </div>

        <Separator />

        <div className="text-center">
          <Link
            href="/register"
            className="hover:text-primary flex items-center justify-center text-sm text-gray-600"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

const VerifyWhatsAppOTP: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-lg">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-center">
              <HeaderHOne title="Loading..." />
            </div>
          </div>
        </div>
      }
    >
      <VerifyWhatsAppOTPContent />
    </Suspense>
  );
};

export default VerifyWhatsAppOTP;
