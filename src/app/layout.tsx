import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import NavBar from '@/components/NavBar';
import QueryProvider from '@/providers/QueryProvider';
import { VideoProvider } from '@/providers/VideoProvider';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import './css/content.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://nextdentist.com'
  ),
  title:
    'NextDentist | Find Trusted Dentists & Book Appointments Online Worldwide',
  description:
    'A Complete Directory of Dentists, Find Top Quality Dentists Near You, Book Your Appointment Online, Dental Care, Dental Services, Dental Implants',
  alternates: {
    canonical: 'https://nextdentist.com',
  },
  keywords: [
    'dentist near me',
    'dentist in my area',
    'dentist in my city',
    'Dental Implants',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Root Canal Treatment',
  ],
  openGraph: {
    title: 'Next Dentist | Find Best Dentists Near You',
    description:
      'A Complete Directory of Dentists, Find Top Quality Dentists Near You, Book Your Appointment Online',
  },
  twitter: {
    title: 'Next Dentist | Find Best Dentists Near You',
    description:
      'A Complete Directory of Dentists, Find Top Quality Dentists Near You, Book Your Appointment Online',
  },
  authors: [{ name: 'Next Dentist' }],
  robots: {
    index: true,
    follow: true,
  },
  publisher: 'Next Dentist',
  category: 'Dentistry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* line height 1.5 */}
      <body className={`h-full min-h-screen`} suppressHydrationWarning>
        <QueryProvider>
          <SessionProvider>
            <VideoProvider>
              <NavBar />
              <div className="prose prose-sm">{children}</div>

              <Footer />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid #e5e7eb',
                  },
                }}
              />
              <CookieBanner />
            </VideoProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
