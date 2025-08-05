'use client';

import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailSent() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Try to retrieve the email from localStorage
    try {
      const pendingRegistration = localStorage.getItem('pendingRegistration');
      if (pendingRegistration) {
        const data = JSON.parse(pendingRegistration);
        setEmail(data.email);
      } else {
        // If no pending registration is found, redirect to register page
        router.push('/register');
      }
    } catch (error) {
      console.error('Error retrieving registration data:', error);
      router.push('/register');
    }
  }, [router]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      // Show loading state or toast
      // You might want to add a loading state here

      const res = await fetch(
        `${window.location.origin}/api/email-varification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Use toast instead of alert for better UX
        alert('Verification email resent successfully!');
      } else {
        alert(`Failed to resend: ${data.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <WhiteRoundedBox className="mx-auto max-w-md p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <MailCheck className="text-primary mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-semibold">Check Your Email</h2>
          <p className="mb-6 text-gray-600">
            We've sent a verification link to{' '}
            <span className="font-medium">{email || 'your email address'}</span>
            . Please check your inbox and click the link to complete your
            registration.
          </p>

          <div className="w-full space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/register">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Registration
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>If you don't see the email, please check your spam folder.</p>
          </div>
        </div>
      </WhiteRoundedBox>
    </div>
  );
}
