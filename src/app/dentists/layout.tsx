import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Most Trusted Dentists Near You | NextDentist',
  description: 'A professional Dentist App built For Dentists by Dentists.',
  keywords: ['appointment', 'booking', 'scheduling', 'dental', 'dentist'],
  authors: [{ name: 'Dr Megha Vyas' }],
  creator: 'NextDentist',
  publisher: 'NextDentist',
  alternates: {
    canonical: 'https://nextdentist.com/dentists',
  },
  openGraph: {
    title: 'Most Trusted Dentists Near You | NextDentist',
    description:
      'A professional Dentist App built For Dentists by Dentists. Dentists can find patients and patients can find dentists.',
    url: 'https://nextdentist.com',
    siteName: 'Most Trusted Dentists Near You | NextDentist',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Most Trusted Dentists Near You | NextDentist Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Most Trusted Dentists Near You | NextDentist',
    description: 'A professional Dentist App built For Dentists by Dentists.',
    creator: '@yourtwitterhandle',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
