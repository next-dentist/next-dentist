import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affordable Dental SEO Services | Book More Appointments',
  description:
    'Transform your dental practice with affordable dental SEO services. Dominate local search, optimize website speed, and fill your appointment book with high-value patients.',
  openGraph: {
    title: 'Affordable Dental SEO Services | Book More Appointments',
    description:
      'Transform your dental practice with affordable dental SEO services. Dominate local search, optimize website speed, and fill your appointment book with high-value patients.',
    url: '/ads/ads2',
    images: [
      {
        url: '/images/nd-seo3.webp',
        width: 1200,
        height: 630,
        alt: 'Google Maps ranking for a dental clinic',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affordable Dental SEO Services | Book More Appointments',
    description:
      'Transform your dental practice with affordable dental SEO services. Dominate local search, optimize website speed, and fill your appointment book with high-value patients.',
    images: ['/images/nd-seo3.webp'],
  },
};

export default function Ads2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
