'use client';

import {
  checkPhoneAvailability,
  sendWhatsAppOTP,
} from '@/app/actions/whatsapp-auth';
import HeaderHOne from '@/components/Headers/HeaderHOne';
import HeaderHThree from '@/components/Headers/HeaderHThree';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { countries } from '@/lib/countries';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Enhanced form schema with phone number structure
const registerFormSchema = z.object({
  name: z.string().optional(),
  phone: z.object({
    country: z.string().min(1, 'Please select a country'),
    number: z
      .string()
      .min(5, 'Phone number must be at least 5 digits')
      .max(10, 'Phone number cannot exceed 10 digits')
      .regex(/^\d+$/, 'Phone number must contain only digits'),
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type RegisterFormValues = {
  name?: string;
  phone: {
    country: string;
    number: string;
  };
  agreeToTerms: boolean;
};

const RegisterWithQTP: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: {
        country: 'US',
        number: '',
      },
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // Get the full phone number with country code
      const selectedCountry = countries.find(
        c => c.code === values.phone.country
      );
      const fullPhoneNumber = `${selectedCountry?.dialCode || '+1'}${values.phone.number}`;

      // Check if phone number is already registered
      const availabilityResult = await checkPhoneAvailability(fullPhoneNumber);

      if (!availabilityResult.success) {
        toast.error('Error', {
          description: availabilityResult.error,
        });
        return;
      }

      if (!availabilityResult.available) {
        toast.error('Phone Number Already Registered', {
          description:
            'This phone number is already registered. Please try logging in instead.',
        });
        return;
      }

      // Send WhatsApp OTP
      const otpResult = await sendWhatsAppOTP(fullPhoneNumber);

      if (!otpResult.success) {
        // Enhanced error handling with specific messages
        let errorTitle = 'Failed to Send OTP';
        let errorDescription = otpResult.error;

        // Check for specific error types
        if (otpResult.error?.includes('Configuration error')) {
          errorTitle = 'Service Configuration Error';
          errorDescription =
            'WhatsApp service is not properly configured. Please contact support.';
        } else if (otpResult.error?.includes('not a valid WhatsApp number')) {
          errorTitle = 'Invalid WhatsApp Number';
          errorDescription =
            'This phone number is not registered with WhatsApp. Please ensure you have WhatsApp installed and activated.';
        } else if (otpResult.error?.includes('access token is invalid')) {
          errorTitle = 'Service Temporarily Unavailable';
          errorDescription =
            'WhatsApp authentication service is temporarily unavailable. Please try again later or contact support.';
        } else if (
          otpResult.error?.includes('rate limit') ||
          otpResult.error?.includes('already sent')
        ) {
          errorTitle = 'Please Wait';
          errorDescription =
            'OTP was recently sent. Please wait before requesting another one.';
        }

        toast.error(errorTitle, {
          description: errorDescription,
          duration: 5000,
        });

        // Log additional details for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('WhatsApp OTP Error Details:', otpResult);
        }

        return;
      }

      toast.success('OTP Sent Successfully', {
        description: 'Please check your WhatsApp for the verification code',
      });

      // Redirect to OTP verification page with necessary data
      const params = new URLSearchParams({
        phone: fullPhoneNumber,
        action: 'register',
      });

      if (values.name && values.name.trim()) {
        params.append('name', values.name.trim());
      }

      router.push(`/verify-whatsapp-otp?${params.toString()}`);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error('Registration Failed', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-center">
          <HeaderHOne title="Create Your Account" />
          <HeaderHThree title="Sign up with your WhatsApp number" />
        </div>

        <div className="mb-4 flex items-center justify-center sm:mb-6">
          <div className="rounded-full bg-green-100 p-2 sm:p-3">
            <MessageSquare className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <input
                id="name"
                {...form.register('name')}
                type="text"
                placeholder="Your full name"
                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Number</Label>
              <PhoneNumberInput
                value={form.watch('phone')}
                onChange={value => form.setValue('phone', value)}
                error={!!form.formState.errors.phone}
                placeholder="Enter 10-digit phone number"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.country?.message ||
                    form.formState.errors.phone.number?.message ||
                    'Please enter a valid phone number'}
                </p>
              )}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Enter your 10-digit mobile number. We'll send you a
                  verification code via WhatsApp
                </p>
                <span
                  className={`text-xs ${
                    form.watch('phone').number.length === 10
                      ? 'text-green-600'
                      : form.watch('phone').number.length > 10
                        ? 'text-red-600'
                        : 'text-gray-400'
                  }`}
                >
                  {form.watch('phone').number.length}/10
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  {...form.register('agreeToTerms')}
                  type="checkbox"
                  className="text-primary focus:ring-primary mt-0.5 rounded border-gray-300"
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-xs leading-5 sm:text-sm"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms-of-services"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.agreeToTerms.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-2 sm:py-3"
            disabled={isLoading}
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
                <span className="text-sm sm:text-base">Sending OTP...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Send WhatsApp OTP</span>
              </span>
            )}
          </Button>
        </form>

        <Separator />

        <div className="text-center">
          <p className="text-xs text-gray-600 sm:text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithQTP;
